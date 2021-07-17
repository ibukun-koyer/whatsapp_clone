function OrDivider() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        height: "2rem",
        alignItems: "center",
      }}
    >
      {/* create line used in the login and signup pages */}
      <hr style={{ width: "50%" }} />
      <span style={{ padding: "1rem" }}>OR</span>
      <hr style={{ width: "50%" }} />
    </div>
  );
}
export default OrDivider;
