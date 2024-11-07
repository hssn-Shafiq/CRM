import { BiChat, BiHeart, BiRepeat, BiShareAlt } from "react-icons/bi";

const Twitter = () => {
  return (
    <>
      <div className="twitter-post-preview border rounded p-3 mb-4">
        <div className="post-header d-flex align-items-center mb-2">
          <img
            src="/images/Profile.jpg"
            alt="Profile"
            className="profile-img rounded-circle me-2"
            width={50}
            height={50}
          />
          <div className="post-details">
            <span className="username text-dark fw-bold">hssn-shafiq</span>
            <span className="handle text-muted ms-2">@handle</span>
            <span className="post-time text-muted ms-2">• 1h</span>
          </div>
        </div>
        <div className="post-content mb-2">
          <p className="m-0">
            This is a sample tweet content for the Twitter post preview.
          </p>
        </div>
        <div className="post-image">
          <img
            src="/images/Profile.jpg"
            alt="Tweet "
            className="w-100 rounded"
          />
        </div>

        <div className="post-actions d-flex justify-content-between mt-2 mx-2">

          <span className="text-muted">
            <i className="bi bi-chat"></i>
            <BiChat />
             10
          </span>
          <span className="text-muted">
            <BiRepeat /> 5
          </span>
          <span className="text-muted">
          <BiHeart /> 20
          </span>
          <span className="text-muted">
            <BiShareAlt />
          </span>

        </div>
      </div>
    </>
  );
};

export default Twitter;
