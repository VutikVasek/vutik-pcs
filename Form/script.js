$(document).ready(function () {

    let lastScrollTop = 0;
    
    $(window).scroll(function(e) {
                    
        let currentScrollTop = $(this).scrollTop();
        if (currentScrollTop > lastScrollTop) {
            // Scroll Down - hide navbar
            $('.navbar').css('top', 'clamp(-120px, -4vw, -65px)');
            $(".menu-phone .menu").hide('hidden');
        } else {
            // Scroll Up - show navbar
            $('.navbar').css('top', '0');
        }
        lastScrollTop = currentScrollTop;
    });

    

    /*$("form").submit(function (e) { 
        e.preventDefault();
        
    });*/
    $("textarea").each(function () { 
        $(this).height(this.scrollHeight + "px");
    });

    $("textarea").on("input", function() {
        $(this).height("auto");
        $(this).height(this.scrollHeight + "px");
    })
    
    //PICTUReS
    function random(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    const pictures = [
        "1-pure",
        "2-pure",
        "3-pure",
        "4-pure",
        "5-pure",
        "6-pure",
        "1-rgb",
        "3-rgb",
        "4-rgb",
        "8-rgb",
        "9-rgb",
        "10-rgb",
        "11-rgb",
        "12-rgb",
        "13-rgb",
        "1-modern",
        "1-mini",
        "2-mini",
        "3-mini",
        "4-mini",
        "5-mini",
        "7-mini",
        "8-mini",
        "9-mini",
        "1-white",
        "2-white",
        "3-white",
        "4-white",
        "5-white",
        "6-white",
        "7-white",
        "8-white",
        "9-white",
        "10-white",
        "11-white",
        "12-white",
        "13-white",
        "14-white",
        "1-normal",
        "2-normal",
        "3-normal",
        "4-normal",
        "5-normal",
        "6-normal",
        "about-us-pc"
    ];

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const rndPic = pictures.splice(Math.floor(Math.random() * pictures.length),1);
            $(".gallery").append(`
                <div class="tile">
                    <a data-fslightbox="${rndPic}" href="../pc-examples/${rndPic}.webp">
                        <img src="../pc-examples/${rndPic}.webp" />
                    </a>
                </div>
            `);
        }
        if (i != 4)
            for (let j = 0; j < 5; j++) {
                $(".gallery").append(`
                    <div class="spacer"></div>
                `);
            }
    };
    refreshFsLightbox();

    //set content and navbar width so the scrollbar doesnt break it when in lightbox
    $(".content").css("width", document.body.clientWidth + 'px');
    $(window).resize(function () { 
        $(".content").css("width", document.body.clientWidth + 'px');
    });

    $(".pc-showcase").mousemove(function (e) {
        var elementOffset = $(this).offset(); // Get the element's offset
        var mouseX = e.pageX - elementOffset.left;
        var mouseY = e.pageY - elementOffset.top;
    
        const xDecimal = mouseX / $(this).width(),
                yDecimal = mouseY / $(this).height();

        const restrain = 20;
        
        const X = -restrain * xDecimal + restrain/2 - 15,
                Y = -restrain * yDecimal + restrain/2 - 15;
        
        gsap.to(".gallery", {
            left: X + "%",
            top: Y + "%",
            duration: 1,
            ease: "sine.out",
        });
    });

    $(".pc-showcase").click(function() {
        $(".pc-showcase > img").fadeOut(500);
        $(".pc-showcase > h2").fadeOut(500);
        $(".pc-showcase > a").fadeOut(500);
        $(this).css("cursor", "initial");
        gsap.to(this, {
            background: "rgba(0, 0, 0, 0)",
            duration: 0.5,
            onComplete: () => {$(this).children().css("z-index", "0")}
        });
        //$(this).children().css("z-index", "0");
    });
    $(".pc-showcase").hover(function() {}, function() {
        gsap.to(".gallery", {
            left: "-15%",
            top: "-15%",
            duration: 3,
            ease: "power3.inOut",
        });
    });

    $(".tile").hover(function() {
        gsap.to(this, {
          scale: 2,
          objectFit: "contain",
          zIndex: 10,
          duration: 0.2,
          ease: "power2.out"
        });
      }, function() {
        gsap.to(this, {
          scale: 1,
          objectFit: "cover",
          zIndex: 1,
          duration: 0.5,
          ease: "power2.out"
        });
        $(this).children().css("object-fit", "cover");
        $(this).css("overflow", "visible");
    });

    /*$(".tile img").click(function() {
        $(this).css("object-fit", "contain");
        $(this).parent().css("overflow", "hidden");
    });*/
    
    importedLocal = true;
    afterImport("local");
});

function afterImport(from) {
    if (importedLocal && importedGlobal) {
    }
}
