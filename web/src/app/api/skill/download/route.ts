import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const skillPath = join(process.cwd(), "..", "skill", "SKILL.md");
    const content = await readFile(skillPath, "utf-8");

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": 'attachment; filename="SKILL.md"',
      },
    });
  } catch {
    return NextResponse.json({ error: "Skill 文件未找到" }, { status: 404 });
  }
}
