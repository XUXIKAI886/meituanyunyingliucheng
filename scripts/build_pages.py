#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将拆分后的页面源码（template + fragments）一键生成回单文件 HTML。

为什么要这样做？
- 开发维护：按模块/按 section 拆分，方便编辑与协作
- 发布交付：生成的 `index.html` / `eleme-operation-guide.html` 仍是单文件，可直接部署到 GitHub Pages，也可离线双击打开

用法：
  python scripts/build_pages.py
  python scripts/build_pages.py --check   # 校验生成结果与当前根目录页面是否一致
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
import re


_INCLUDE_RE = re.compile(r"@include\s+(?P<value>[^\s]+)")
_INCLUDE_GLOB_RE = re.compile(r"@include_glob\s+(?P<value>[^\s]+)")


def _detect_newline(data: bytes) -> str:
    return "\r\n" if b"\r\n" in data else "\n"


def _normalize_newlines(text: str, newline: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    if newline == "\n":
        return text
    return text.replace("\n", "\r\n")


def _read_utf8(path: Path) -> str:
    return path.read_bytes().decode("utf-8")


def _render_file(path: Path, newline: str, stack: list[Path]) -> str:
    if path in stack:
        chain = " -> ".join(p.as_posix() for p in stack + [path])
        raise RuntimeError(f"检测到循环 include：{chain}")

    stack.append(path)
    base_dir = path.parent

    raw = _read_utf8(path)
    # 先统一成 LF，渲染完成后再转换回目标换行，避免混用
    raw = _normalize_newlines(raw, "\n")

    out_parts: list[str] = []
    for line in raw.splitlines(keepends=True):
        m_glob = _INCLUDE_GLOB_RE.search(line)
        if m_glob:
            pattern = m_glob.group("value")
            matches = sorted(base_dir.glob(pattern))
            if not matches:
                raise FileNotFoundError(f"未匹配到任何文件：{path.as_posix()} 中的 {pattern}")
            for item in matches:
                rendered = _render_file(item, newline, stack)
                if rendered and not rendered.endswith(newline):
                    rendered += newline
                out_parts.append(rendered)
            continue

        m_inc = _INCLUDE_RE.search(line)
        if m_inc:
            rel = m_inc.group("value")
            target = (base_dir / rel).resolve()
            if not target.exists():
                raise FileNotFoundError(f"include 文件不存在：{path.as_posix()} -> {rel}")
            rendered = _render_file(target, newline, stack)
            if rendered and not rendered.endswith(newline):
                rendered += newline
            out_parts.append(rendered)
            continue

        out_parts.append(_normalize_newlines(line, newline))

    stack.pop()
    return "".join(out_parts)


def build_one(template_path: Path) -> str:
    template_bytes = template_path.read_bytes()
    newline = _detect_newline(template_bytes)
    rendered = _render_file(template_path, newline, stack=[])
    # 最终输出统一为模板的换行风格
    rendered = _normalize_newlines(rendered, newline)
    return rendered


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="从拆分源码生成单文件 HTML 页面")
    parser.add_argument("--check", action="store_true", help="仅校验：生成结果需与当前根目录文件一致")
    args = parser.parse_args(argv)

    root = Path(__file__).resolve().parents[1]

    targets = [
        (root / "src" / "pages" / "meituan" / "template.html", root / "index.html"),
        (root / "src" / "pages" / "eleme" / "template.html", root / "eleme-operation-guide.html"),
    ]

    ok = True
    for template_path, out_path in targets:
        if not template_path.exists():
            print(f"缺少模板文件：{template_path}", file=sys.stderr)
            return 2

        if args.check:
            rendered = build_one(template_path)
            current = out_path.read_bytes().decode("utf-8") if out_path.exists() else ""
            if current != rendered:
                ok = False
                print(f"校验失败：{out_path.name} 与生成结果不一致", file=sys.stderr)
            else:
                print(f"校验通过：{out_path.name}")
        else:
            rendered = build_one(template_path)
            out_path.write_bytes(rendered.encode("utf-8"))
            print(f"已生成：{out_path.name}")

    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
