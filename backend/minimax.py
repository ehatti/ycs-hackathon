# Minimax wrappers
import os
import requests
import base64
from typing import Optional, Dict, Any

MINIMAX_API_KEY = os.getenv('MINIMAX_KEY')
MINIMAX_API_URL = "https://api.minimax.io/v1/image_generation"


def generate_virtual_tryon(
    prompt: str,
    subject_image_url: str,
    aspect_ratio: str = "1:1"
) -> Dict[str, Any]:
    """
    Generate a virtual try-on image using Minimax's image-01 model with subject reference.

    Args:
        prompt: Text description of how to render the subject with the item
        subject_image_url: URL of the reference image (person or room)
        aspect_ratio: Image aspect ratio (default "1:1")

    Returns:
        Dictionary containing:
            - success: Boolean indicating if generation succeeded
            - image_base64: Base64 encoded image data (if successful)
            - error: Error message (if failed)
    """
    if not MINIMAX_API_KEY:
        return {
            "success": False,
            "error": "Minimax API key not configured"
        }

    headers = {
        "Authorization": f"Bearer {MINIMAX_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "image-01",
        "prompt": prompt,
        "aspect_ratio": aspect_ratio,
        "response_format": "base64",
        "subject_reference": [
            {
                "type": "character",
                "image_file": subject_image_url
            }
        ]
    }

    try:
        response = requests.post(MINIMAX_API_URL, json=payload, headers=headers, timeout=60)
        response.raise_for_status()

        result = response.json()

        # Check if the API call was successful
        if result.get("base_resp", {}).get("status_code") == 0:
            image_base64_list = result.get("data", {}).get("image_base64", [])
            if image_base64_list:
                return {
                    "success": True,
                    "image_base64": image_base64_list[0]
                }
            else:
                return {
                    "success": False,
                    "error": "No image data returned from API"
                }
        else:
            error_msg = result.get("base_resp", {}).get("status_msg", "Unknown error")
            return {
                "success": False,
                "error": f"API error: {error_msg}"
            }

    except requests.exceptions.Timeout:
        return {
            "success": False,
            "error": "Request timed out after 60 seconds"
        }
    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "error": f"Request failed: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Unexpected error: {str(e)}"
        }


def create_category_prompt(category: str, item_description: str) -> str:
    """
    Create a category-specific prompt for virtual try-on.

    Args:
        category: Listing category (e.g., "Clothing", "Furniture & Decor")
        item_description: Description of the item from the listing

    Returns:
        Formatted prompt string for the Minimax API
    """
    if category.lower() == "clothing":
        return f"A realistic photo showing the person wearing {item_description}. The clothing should fit naturally on the person's body with realistic lighting, shadows, and fabric draping. Maintain the person's pose and appearance while seamlessly integrating the clothing item. Professional photography style, high quality, photorealistic."

    elif category.lower() == "furniture & decor":
        return f"A realistic interior photo showing {item_description} placed in the room or space. The furniture/decor should fit naturally in the environment with realistic lighting, shadows, and perspective. Maintain the room's style and atmosphere while seamlessly integrating the item. Professional interior design photography, high quality, photorealistic."

    else:
        # Fallback generic prompt
        return f"A realistic photo showing {item_description} in the scene. Natural lighting, high quality, photorealistic."
