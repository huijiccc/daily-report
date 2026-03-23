#!/usr/bin/env python3
"""
DailyReport - 每日资讯抓取脚本
"""
import json
import os
import requests
from datetime import datetime
from pathlib import Path

CONFIG = {
    "topics": ["游戏", "AI科技", "股票"],
    "output_dir": "output",
}

def search_news(topic):
    """使用 Tavily API 搜索热点新闻"""
    api_key = os.getenv("TAVILY_API_KEY", "")
    
    if not api_key:
        # 如果没有 API key，使用备用方案
        return get_fallback_news(topic)
    
    url = "https://api.tavily.com/search"
    headers = {"Content-Type": "application/json"}
    data = {
        "api_key": api_key,
        "query": f"{topic} 最新消息 2026",
        "search_depth": "basic",
        "max_results": 5
    }
    
    try:
        resp = requests.post(url, json=data, headers=headers, timeout=10)
        results = resp.json().get("results", [])
        return [{"title": r.get("title", ""), "content": r.get("content", "")[:200], "url": r.get("url", "")} for r in results]
    except Exception as e:
        print(f"搜索 {topic} 失败: {e}")
        return get_fallback_news(topic)

def get_fallback_news(topic):
    """备用新闻源"""
    return [
        {"title": f"{topic} 热点1", "content": "点击查看详情", "url": "#"},
        {"title": f"{topic} 热点2", "content": "点击查看详情", "url": "#"},
    ]

def generate_markdown(news_data):
    """生成 Markdown 日报"""
    date = datetime.now().strftime("%Y年%m月%d日")
    
    md = f"""# 📰 每日简报 - {date}

> 关注领域：游戏 · AI科技 · 股票

---
"""
    for topic, articles in news_data.items():
        md += f"\n## 🎯 {topic}\n\n"
        for i, art in enumerate(articles, 1):
            md += f"{i}. **{art['title']}**\n   - {art['content']}\n   - [原文链接]({art['url']})\n"
    
    md += f"""
---
*由 DailyReport 自动生成 · {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}*
"""
    return md

def generate_html(markdown_content):
    """简单的 Markdown 转 HTML"""
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>每日简报</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }}
        .container {{ background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        h1 {{ color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }}
        h2 {{ color: #007acc; margin-top: 30px; }}
        a {{ color: #007acc; text-decoration: none; }}
        a:hover {{ text-decoration: underline; }}
        .meta {{ color: #888; font-size: 14px; margin-bottom: 20px; }}
        blockquote {{ border-left: 4px solid #007acc; margin: 0; padding-left: 15px; color: #666; }}
    </style>
</head>
<body>
    <div class="container">
        {markdown_content.replace('# ', '<h1>').replace('## ', '<h2>').replace('**', '<strong>').replace('\n', '<br>')}
    </div>
</body>
</html>"""
    return html

def main():
    print("🔍 开始收集资讯...")
    
    news_data = {}
    for topic in CONFIG["topics"]:
        print(f"  搜索: {topic}")
        news_data[topic] = search_news(topic)
    
    # 生成 Markdown
    md_content = generate_markdown(news_data)
    output_dir = Path(CONFIG["output_dir"])
    output_dir.mkdir(exist_ok=True)
    
    date_str = datetime.now().strftime("%Y-%m-%d")
    md_file = output_dir / f"report-{date_str}.md"
    md_file.write_text(md_content, encoding="utf-8")
    print(f"✅ Markdown: {md_file}")
    
    # 生成 HTML
    html_content = generate_html(md_content)
    html_file = output_dir / "index.html"
    html_file.write_text(html_content, encoding="utf-8")
    print(f"✅ HTML: {html_file}")
    
    # 生成 GitHub Pages index
    index_file = output_dir / "README.md"
    index_file.write_text(md_content, encoding="utf-8")
    
    print("🎉 完成!")

if __name__ == "__main__":
    main()
