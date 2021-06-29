import { Fragment, useState, useEffect } from "react";
import HoverSVG from "./titleSVG/hoverSVG";

function AttachmentSVG({
  className,
  incoming,
  children,
  text,
  position,
  onClick,
}) {
  const [showTitle, setShow] = useState(false);
  //   experimental content
  const [showContent, setShowContent] = useState(true);
  useEffect(() => {
    if (incoming === undefined) {
      setShowContent(false);
    } else if (!incoming) {
      const timeout = setTimeout(() => {
        setShowContent(false);
      }, 400);
      return () => clearTimeout(timeout);
    } else {
      setShowContent(true);
    }
  }, [incoming]);
  //   end of experimental content
  return (
    <Fragment>
      {showContent ? (
        <Fragment>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 53 53"
            width="53"
            height="53"
            className={className}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            key={incoming}
            onClick={onClick}
          >
            {children}
          </svg>
          {showTitle ? <HoverSVG text={text} position={position} /> : null}
        </Fragment>
      ) : null}
    </Fragment>
  );
}
export default AttachmentSVG;
