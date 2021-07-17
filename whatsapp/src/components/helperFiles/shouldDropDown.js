function shouldShowDropDown(
  target,
  context,
  createdAt,
  externalArr,
  exceptionSubtractionX,
  setCurrentlyClicked,
  invertCondition
) {
  // if this icon is currentlyClicked, unclick it
  if (invertCondition()) {
    context.setShow(false);
  } else {
    //we want to show it
    let heightFromTop;
    let LengthFromLeft;
    let currNode = target;
    let bodyScrollHeight = 0;
    heightFromTop = 0;
    LengthFromLeft = 0;
    // what we do here is get offsetX, offsetY, for the icon
    while (currNode.className.indexOf("mainHome") === -1) {
      if (window.getComputedStyle(currNode).position !== "static") {
        if (
          currNode.className.indexOf("screen") === -1 &&
          currNode.className.indexOf("message") === -1
        ) {
          heightFromTop += currNode.offsetTop;
        }
        if (currNode.className.indexOf("body") !== -1) {
          bodyScrollHeight = currNode.scrollTop;
        }
        LengthFromLeft += currNode.offsetLeft;
      }

      currNode = currNode.parentElement;
    }
    heightFromTop -= bodyScrollHeight;
    heightFromTop += currNode.offsetTop;
    LengthFromLeft += currNode.offsetLeft;

    //end of getting offsetx and offsety
    //if we need to make twicks to the current x, we pass in a twick value in pixels
    if (exceptionSubtractionX) {
      LengthFromLeft -= exceptionSubtractionX;
    }
    //we set the currently clicked to the time
    if (setCurrentlyClicked) setCurrentlyClicked(createdAt);
    //requesting full screen
    const defaultArr = ["Reply", "Delete Message"];
    const menuOptions = externalArr ? externalArr : defaultArr;
    //here we set the position of where the item would stay on screen.
    context.setMarginSize(1.5);
    context.setFontSize(1);
    context.setNumberOfOptions(menuOptions.length);
    context.setX(LengthFromLeft);
    context.setY(heightFromTop);
    context.setHeight(parseFloat(window.getComputedStyle(target).height));
    context.setMenuOptions(menuOptions);
    // tell options to display
    context.setShow(true);
  }
}
export default shouldShowDropDown;
