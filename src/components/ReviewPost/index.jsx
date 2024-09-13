import { Link } from "react-router-dom";

const ReviewPost = () => {
  return (
    <>
      <div className="card">
        <div className="card-header">Post Preview</div>
        <div className="card-body text-light" id="postPreview">
          <p>Select a social account and a post to preview</p>
        </div>
      </div>
      <div className="post-card">
        <div className="post-header">
          <img src="/images/profile.jpg" alt="short " className="profile-pic" />
          <div>
            <strong className="mb-0 text-dark">Hassan Shafiq</strong>
            <br />
            <small className="text-muted">Just now</small>
          </div>
        </div>
        <div className="post-content mt-3">
          <p>This is an dummy post for scheduling!</p>
          <img
            src="/images/profile.jpg"
            className="w-100 object-fit-cover"
            style={{ objectPosition: "top" }}
            alt="review pr"
          />
        </div>
        <div className="post-actions">
          <Link to="#">
            <i className="far fa-thumbs-up"></i> Like
          </Link>
          <Link to="#">
            <i className="far fa-comment"></i> Comment
          </Link>
          <Link to="#">
            <i className="fas fa-share"></i> Share
          </Link>
        </div>
      </div>
    </>
  );
};

export default ReviewPost;
