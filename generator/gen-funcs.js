
function openFrame(url) {
    let frame = document.createElement('iframe');
    $(frame).attr("src", url);
    $(frame).attr("allowtransparency", "true");
    document.body.appendChild(frame);
    gsap.fromTo(frame, {
        opacity: 0,
    }, {
        opacity: 1,
        duration: 0.2,
        ease: "sine.inOut",
    });
    $(".navbar").css('top', 'clamp(-120px, -4vw, -65px)');
    $("html").css("overflow", "hidden");
    if (window.matchMedia("(max-aspect-ratio: 1/1)").matches) $(".filter").css("z-index", "20");
    window.addEventListener('touchmove', preventTouchScroll, { passive: false });
}

$(window).on('message', function(event) {
    const message = event.originalEvent.data;
    if (message === 'close-iframe') {
      $('iframe').remove();
      $("html").css("overflow", "");
      $(".filter").css("z-index", "-1");
      window.removeEventListener('touchmove', preventTouchScroll, { passive: false });
    }
});