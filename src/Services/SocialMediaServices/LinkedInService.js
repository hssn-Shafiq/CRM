import api from './ApiConfiguration';

class LinkedInService {
  static async post(content, media, accessToken) {
    try {
      // Check if we have a valid token
      if (!accessToken) {
        throw new Error(
          "No LinkedIn access token found. Please reconnect your account."
        );
      }

      console.log(
        "Posting to LinkedIn with token:",
        accessToken.substring(0, 10) + "..."
      );

      const response = await api.post("/linkedin/post", {
        accessToken,
        content,
        media_urls: media,
      });

      return {
        success: true,
        data: response.data,
        platform: "linkedin",
      };
    } catch (error) {
      console.error("LinkedIn posting error:", error);

      // Improve error message based on status code
      let errorMessage = "Failed to post to LinkedIn";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage =
            "LinkedIn authentication expired. Please reconnect your account.";
        } else if (error.response.status === 403) {
          errorMessage =
            "You don't have permission to post to LinkedIn. Please check your account settings.";
        } else if (error.response.status === 404) {
          errorMessage =
            "LinkedIn API endpoint not found. Server configuration issue.";
        }
      }

      throw {
        success: false,
        error: errorMessage,
        platform: "linkedin",
        originalError: error,
      };
    }
  }

  static async postWithMedia(content, mediaFiles, accessToken) {
    try {
      // Check if we have a valid token
      if (!accessToken) {
        throw new Error(
          "No LinkedIn access token found. Please reconnect your account."
        );
      }

      // Clean and validate content to prevent UTF-8 issues
      const cleanContent = content ? content.trim() : '';
      if (!cleanContent) {
        throw new Error("Content is required for posting");
      }

      console.log("Posting to LinkedIn with media:");
      console.log("- Content length:", cleanContent.length);
      console.log("- Media files count:", mediaFiles.length);
      console.log("- Token:", accessToken.substring(0, 10) + "...");

      // Create FormData to send files
      const formData = new FormData();
      formData.append("content", cleanContent);
      formData.append("accessToken", accessToken);

      // Add media files as an array
      if (mediaFiles && mediaFiles.length > 0) {
        for (let i = 0; i < mediaFiles.length; i++) {
          // Convert blob URL to actual file
          try {
            console.log(`Processing media file ${i + 1}/${mediaFiles.length}:`, mediaFiles[i]);

            const response = await fetch(mediaFiles[i]);
            if (!response.ok) {
              throw new Error(`Failed to fetch media file: ${response.status}`);
            }

            const blob = await response.blob();
            console.log(`Media ${i + 1} blob size:`, blob.size, 'type:', blob.type);

            // Validate file size (max 10MB)
            if (blob.size > 10 * 1024 * 1024) {
              throw new Error(`Media file ${i + 1} is too large (max 10MB)`);
            }

            // Determine file extension from blob type
            let extension = 'jpg';
            if (blob.type.includes('png')) extension = 'png';
            else if (blob.type.includes('gif')) extension = 'gif';
            else if (blob.type.includes('webp')) extension = 'webp';

            const filename = `media-${Date.now()}-${i}.${extension}`;
            const file = new File([blob], filename, {
              type: blob.type || "image/jpeg",
            });

            formData.append("media[]", file); // Use media[] to create an array
            console.log(`Added media file: ${filename} (${file.size} bytes)`);
          } catch (error) {
            console.error(`Error processing media file ${i + 1}:`, error);
            // Don't throw here, just skip the problematic file
            // throw new Error(`Failed to process media file ${i + 1}: ${error.message}`);
          }
        }
      }

      // Send the post with media
      const response = await api.post(
        "/linkedin/post-with-media",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: true,
        data: response.data,
        platform: "linkedin",
      };
    } catch (error) {
      console.error("LinkedIn posting error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      let errorMessage = "Failed to post to LinkedIn";

      if (error.response?.data?.error) {
        const errorData = error.response.data.error;
        if (typeof errorData === 'string' && errorData.includes('UTF-8')) {
          errorMessage = "Content contains invalid characters. Please remove emojis or special characters and try again.";
        } else if (typeof errorData === 'string' && errorData.includes('json_encode')) {
          errorMessage = "Server encoding error. Please try again with simpler text content.";
        } else {
          errorMessage = errorData;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw {
        success: false,
        error: errorMessage,
        platform: "linkedin",
        originalError: error.response?.data || error,
      };
    }
  }
}

export default LinkedInService;