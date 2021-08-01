import ContactInfo from "./ContactInfo";

let curr = "";
function CreateAllContact({ contacts, onClick, fxnId }) {
  return (
    <div>
      {contacts.map((elem) => {
        if (!elem.hide) {
          let show = false;
          if (/^[0-9]/.test(elem.username[0].toUpperCase())) {
            if (curr !== "#") {
              show = true;
              curr = "#";
            }
          } else if (!/^[A-Z]/.test(elem.username[0].toUpperCase())) {
            if (curr === "$") {
              show = true;
              curr = "$";
            }
          } else if (curr === "" || curr !== elem.username[0].toUpperCase()) {
            show = true;
            curr = elem.username[0].toUpperCase();
          }

          return (
            <ContactInfo
              email={elem.email}
              username={elem.username}
              status={elem.status}
              url={elem.url}
              key={elem.email}
              letterDes={{ show, curr }}
              onClick={onClick}
              fxnId={fxnId}
              online={elem.online}
            />
          );
        }
      })}
    </div>
  );
}
export default CreateAllContact;
