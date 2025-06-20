import api from './ApiConfiguration';

class SocialMediaPostScheduler {
  static async schedulePostsToAllPlatforms(
    content,
    media,
    platforms,
    scheduleDate,
    scheduleTime,
    type = "Post"
  ) {
    try {
      // Convert to ISO datetime format
      const scheduledDateTime = `${
        scheduleDate.toISOString().split("T")[0]
      }T${scheduleTime}:00`;

      const response = await api.post("/api/schedule/posts", {
        content,
        media_urls: media,
        platforms,
        scheduled_time: scheduledDateTime,
        post_type: type,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Scheduling error:", error);
      throw {
        success: false,
        error: error.response?.data?.message || "Failed to schedule posts",
      };
    }
  }

  static async getScheduledPosts() {
    try {
      const response = await api.get("/api/schedule/posts");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching scheduled posts:", error);
      throw {
        success: false,
        error: error.response?.data?.message || "Failed to fetch scheduled posts",
      };
    }
  }

  static async cancelScheduledPost(postId) {
    try {
      const response = await api.delete(`/api/schedule/posts/${postId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error canceling scheduled post:", error);
      throw {
        success: false,
        error: error.response?.data?.message || "Failed to cancel scheduled post",
      };
    }
  }
}

export default SocialMediaPostScheduler;