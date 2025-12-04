from openai import OpenAI
from .config import settings
from .prompts import madhav_system_prompt


client = OpenAI(api_key=settings.OPENAI_API_KEY)


async def generate_madhav_reply(user_message: str, chat_context: str | None = None) -> str:
    """
    Single place where we call OpenAI.
    """
    system_content = madhav_system_prompt
    if chat_context:
        system_content += f"\n\nConversation context:\n{chat_context}"

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_content},
                {"role": "user", "content": user_message},
            ],
            temperature=0.4,
            max_tokens=350,
            top_p=0.9,
        )
        content = completion.choices[0].message.content
        # content can be str or list – normalize
        if isinstance(content, list):
            return "".join(part.get("text", "") for part in content)
        return content or "Radhe Radhe mitra, mujhe thoda sa sochne do, dobara likhoge kya?"
    except Exception as e:
        # Do NOT leak full details to user in production
        return f"Radhe Radhe mitra, thoda technical issue aa gaya hai. (AI error: {str(e)[:80]})"
