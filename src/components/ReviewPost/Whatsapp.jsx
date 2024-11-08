
const Whatsapp = () => {

  return (
    <>
      <div className="whatsapp-message-preview border rounded p-3 mb-4">
        <div className="message-header d-flex align-items-center mb-2">
          <img
            src="/images/Profile.jpg"
            alt="Profile"
            className="profile-img rounded-circle me-2"
            width={50}
            height={50}
          />
          <div className="message-details">
            <span className="sender-name fw-bold text-dark">Hassan Shafiq</span>
            <span className="message-time text-muted ms-2">12:45 PM</span>
          </div>
        </div>
        <div className="message-content">
          <p className="m-0">
            This is a sample WhatsApp message preview content.
          </p>
        </div>
      </div>
    </>
  );
};

export default Whatsapp;
