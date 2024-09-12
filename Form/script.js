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

    console.log(window.innerHeight);

    

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
        "1-pure.jpeg",
        "2-pure.jpeg",
        "3-pure.jpeg",
        "4-pure.jpeg",
        "5-pure.jpeg",
        "6-pure.jpeg",
        "1-rgb.jpeg",
        "3-rgb.jpg",
        "4-rgb.png",
        "8-rgb.jpeg",
        "9-rgb.jpeg",
        "10-rgb.png",
        "11-rgb.png",
        "12-rgb.jpeg",
        "13-rgb.jpeg",
        "1-modern.jpg",
        "1-mini.jpeg",
        "2-mini.jpeg",
        "3-mini.jpeg",
        "4-mini.jpg",
        "5-mini.png",
        "7-mini.png",
        "8-mini.jpeg",
        "9-mini.jpeg",
        "1-white.png",
        "2-white.png",
        "3-white.jpeg",
        "4-white.jpeg",
        "5-white.png",
        "6-white.png",
        "7-white.png",
        "8-white.jpeg",
        "9-white.jpeg",
        "10-white.jpeg",
        "11-white.png",
        "12-white.png",
        "13-white.jpeg",
        "14-white.png",
        "1-normal.jpeg",
        "2-normal.jpeg",
        "3-normal.jpeg",
        "4-normal.jpeg",
        "5-normal.jpeg",
        "6-normal.jpeg"];

    /*const rndPic = pictures.splice(Math.floor(Math.random() * pictures.length),1);
    
    $(".blured").attr('src', rndPic);
    $(".focused").attr('src', rndPic);*/

    /*for (let i = 0; i < 22; i++) {
        const rndPic = pictures.splice(Math.floor(Math.random() * pictures.length),1);
    
        $(".gallery").append(`
            <div class="tile" style="width: ${random(15, 20)}%; height: ${random(15, 25)}%;">
                <img src="../pc-examples/${rndPic}" />
            </div>
        `)

    }*/

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const rndPic = pictures.splice(Math.floor(Math.random() * pictures.length),1);
            $(".gallery").append(`
                <div class="tile">
                    <img src="../pc-examples/${rndPic}" />
                </div>
            `);
        }
        if (i != 4)
            for (let j = 0; j < 5; j++) {
                $(".gallery").append(`
                    <div class="spacer"></div>
                `);
            }
    }

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

    $(".pc-showcase").hover(function() {
        $(".pc-showcase > span").fadeOut(500);
        $(".pc-showcase > h2").fadeOut(500);
        gsap.to(this, {
            background: "rgba(0, 0, 0, 0)",
            duration: 0.5,
            onComplete: () => {$(this).children().css("z-index", "0")}
        });
        //$(this).children().css("z-index", "0");
    }, function() {
        gsap.to(".gallery", {
            left: "-15%",
            top: "-15%",
            duration: 3,
            ease: "power3.inOut",
        });
    });

    $(".tile").hover(function() {
        gsap.to(this, {
          scale: 2.5,
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

    $(".tile img").click(function() {
        $(this).css("object-fit", "contain");
        $(this).parent().css("overflow", "hidden");
    });
    

    
});
