export function onImageChange(fileObj, setImageError, setImageRef) {

  if (fileObj !== undefined) {
    if (fileObj.size > 1048576) {
      setImageError("Image size must not exceed 1MB");

    } else if (!/^(image|video)/i.test(fileObj.type)) {
      setImageError("File must be an image or a video");
    } else {
      try {
        const objectURL = window.URL.createObjectURL(fileObj);
        setImageError("");
        if (setImageRef) {
      
          setImageRef(objectURL);
        } else {
     
          return objectURL;
        }
      } catch (e) {
 
        setImageError("File is incompatible, Please try another");
      }
    }
  }
}
export function onImageSubmit(
  defaultImage,
  imageRef,
  onImageStoredCallback,
  onFailed,
  type
) {
  if (defaultImage !== imageRef) {
    const formData = new FormData();

    let xhr = new XMLHttpRequest();
    xhr.open("GET", imageRef, true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
      if (this.status === 200) {
        formData.append("file", this.response);
        formData.append("upload_preset", "ml_default");
        const options = {
          method: "POST",
          body: formData,
        };

        fetch(
          "https://api.Cloudinary.com/v1_1/" +
            process.env.REACT_APP_cloudinary +
            "/" +
            type +
            "/upload",
          options
        )
          .then((res) => res.json())
          .then((res) => {

            onImageStoredCallback(res.secure_url);
          })
          .catch((err) => onFailed(err));
      }
    };
    xhr.send();
  } else {
    onImageStoredCallback(imageRef);
  }
}
