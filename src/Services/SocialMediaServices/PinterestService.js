import api from './ApiConfiguration';

class PinterestService {
  static async post(content, media, accessToken) {
    try {
      // Check if we have a valid token
      if (!accessToken) {
        throw new Error(
          "No Pinterest access token found. Please reconnect your account."
        );
      }

      const response = await api.post("/pinterest/post", {
        accessToken,
        content,
        media_urls: media,
      });

      return {
        success: true,
        data: response.data,
        platform: "pinterest",
      };
    } catch (error) {
      console.error("Pinterest posting error:", error)

      throw {
        success: false,
        platform: "pinterest",
        originalError: error,
      };
    }
  }

  static async postWithMedia(content, mediaFiles, accessToken) {
    try {
      // Create FormData to send files
      const formData = new FormData();
      formData.append("content", content);
      formData.append("accessToken", accessToken);

      // Add media files
      for (let i = 0; i < mediaFiles.length; i++) {
        try {
          const response = await fetch(mediaFiles[i]);
          const blob = await response.blob();
          const filename = `image-${i}.jpg`;
          const file = new File([blob], filename, {
            type: blob.type || "image/jpeg",
          });
          formData.append("media[]", file);
        } catch (error) {
          console.error("Error processing media file:", error);
        }
      }

      // Send the post with media
      const response = await api.post(
        "/pinterest/post-with-media",
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
        platform: "pinterest",
      };
    } catch (error) {
      console.error("Pinterest posting error:", error);
      throw {
        success: false,
        error: error.response?.data?.message || "Failed to post to Pinterest",
        platform: "pinterest",
      };
    }
  }

  static async getBoards(accessToken) {
    try {
      const response = await api.get("/pinterest/boards", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return {
        success: true,
        boards: response.data.boards || [],
      };
    } catch (error) {
      console.error("Error fetching Pinterest boards:", error);
      throw {
        success: false,
        error: error.response?.data?.message || "Failed to fetch Pinterest boards",
      };
    }
  }

  static async postToBoard(content, media, accessToken, boardId) {
    try {
      const response = await api.post("/pinterest/post-to-board", {
        accessToken,
        content,
        media_urls: media,
        board_id: boardId,
      });

      return {
        success: true,
        data: response.data,
        platform: "pinterest",
      };
    } catch (error) {
      console.error("Pinterest board posting error:", error);
      throw {
        success: false,
        error: error.response?.data?.message || "Failed to post to Pinterest board",
        platform: "pinterest",
      };
    }
  }
}

export default PinterestService;