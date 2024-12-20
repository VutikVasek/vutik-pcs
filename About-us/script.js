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

    //set content and navbar width so the scrollbar doesnt break it when in lightbox
    $(".content").css("width", document.body.clientWidth + 'px');
    $(window).resize(function () { 
        $(".content").css("width", document.body.clientWidth + 'px');
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.to(entry.target, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power2.out'
                });
                observer.unobserve(entry.target);
            }
        })
    },  {
       threshold: 0.1 
    });

    $(".sign").each(function() {
        observer.observe(this);
    });

    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(pointer: fine)").matches) {
        $(".prebuilds .sign").hover(function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            })
        }, function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            })
        });
    } else {
        $.each($(".prebuilds .sign"), function(i) {
            gsap.fromTo(this, {
                scale: 1.1,
            }, {
                scrollTrigger: {
                    trigger: this,
                    start: "25rem center",
                    end: "-25rem top",
                    invalidateOnRefresh: true,
                    markers: false,
                    scrub: true,
                },
                scale: 1,
                ease: 'power2.out',
            });
            gsap.fromTo(this, {
                scale: 1,
            }, {
                scrollTrigger: {
                    trigger: this,
                    start: "80rem bottom",
                    end: "25rem center",
                    invalidateOnRefresh: true,
                    markers: false,
                    scrub: true,
                },
                scale: 1.1,
                ease: 'power2.in',
            });
        });
    }
    

});

function preventTouchScroll(event) {
    event.preventDefault();
}

$(".prebuilds .sign").click(function (e) {
    openFrame(`../generator/?theme=${$(this).attr("class").split(" ")[1]}&type=theme`)
})
  