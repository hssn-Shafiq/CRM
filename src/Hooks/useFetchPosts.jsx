// src/hooks/useFetchPosts.js
import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchPosts = () => {
  const [fPosts, setFPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = "Bearer 1|nq8njnFmxYLoda5ImMgwwdxXGb7ONugJLpCCYsYff4264dcc";
        const response = await axios.get("https://crmapi.alayaarts.com/api/posts", {
          headers: {
            Authorization: `${token}`, // Include the token in the request headers
            "Content-Type": "multipart/form-data", // Set content type to FormData
          },
        });
        const postsData = response.data?.fb_posts || [];
        setFPosts(postsData);
      } catch (error) {
        setPostError("Error fetching posts");
        console.error("Error fetching posts:", error);
      } finally {
        setPostLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return { fPosts, postLoading, postError };
};
