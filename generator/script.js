const params = new URLSearchParams(window.location.search);
const type = params.get('type');
const theme = params.get('theme');
const price = params.get('price');

if (type && theme) {
    let pb;
    fetch('../global/prebuilds.json')
        .then(response => response.json())
        .then(data => {
            pb = data.prebuilds.find(build => build.key === theme);
        })
        .catch(error => console.error('Error fetching JSON:', error))
        .finally(() => {
            if (pb) {
                if (type === "prebuild") {
                    if (price) {
                        //open('d', pb.name, pb.description, pb.style, [pb.builds[price].price], [pb.builds[price].components], pb.builds[price].case)
                        open('d', pb, price);
                    }
                } 
                else if (type === "theme") {
                    //open('p', pb.name, pb.description, pb.style, pb.builds.map(b => b.price), pb.builds.map(b => b.components));
                    open('p', pb);
                }
            }
            
            //CAROUSEL
            $(".glide").each(function() {
                new Glide(this, {
                    type: 'carousel',
                    perView: 1,
                    keyboard: false,
                }).mount().update().update();
            });

            //LAZY LOADING
            $(".lazy").each(function () {
                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const url = $(entry.target).data("bg");
                            $(entry.target).addClass('show-before');
                            const loadImage = () => {
                                const img = new Image();
                                img.src = url;
                                img.onload = () => {
                                    $(entry.target).css("background-image", `url(${url})`);
                                    $(entry.target).removeClass('show-before');
                                    observer.unobserve(entry.target);
                                }
                               img.onerror = (err) => {
                                    if (!navigator.onLine) {
                                        window.addEventListener('online', retryLoad);
                                    }
                                }
                            }
                            const retryLoad = () => {
                                window.removeEventListener('online', retryLoad);
                                loadImage();
                            }
                            loadImage();
                        }
                    });
                });
                observer.observe(this);
            });

            const close = () => { window.parent.postMessage('close-iframe') }

            $('.cross').on('click', close);
            $('body > *').click(function(e) {
                if (this === e.target) close();
            })
            
            $(window).mousemove(function (e) { 
                gsap.to('.close', {
                    x: e.clientX,
                    y: e.clientY,
                    translate: "-50% -50%",
                    top: 0,
                    left: 0,
                    duration: 0.3,
                    ease: 'sine.out',
                });
            });
            
            //refreshFsLightbox();
        });
}

function preventTouchScroll(event) {
    event.preventDefault();
}

function open(type, pb, build = 0) {
    $(".card").css("background", `linear-gradient(to top right, ${pb.style.dark}, ${pb.style.light})`)
              .css("--accent", pb.style.accent);
    $(".info .title h3").text(pb.name + (type === "d" ? ` - ${pb.builds[build].price}` : ""));
    $(".info .title p").text(pb.description);
    $(".theme-prices .buttons").children().each((index, button) => {
        if (!index) {
            $(button).css("font-weight", 600);
            $(button).css("background","rgba(255, 255, 255, 0.7)");
            $(button).css("scale", "1.1");
            $(button).addClass("active");
        } 
        button.textContent = pb.builds[index].price;
        $(button).hover(() => changeComponenets(button, index, pb.builds[index].components), () => {});
        $(button).click(() => {
            if (window.matchMedia("(pointer: fine)").matches || $(button).css("scale") == 1.1)
                openFrame(`./?theme=${pb.key}&type=prebuild&price=${index}`);
            else 
                changeComponenets(button, index, pb.builds[index].components);
        });
    });
    $(".info ul").html(
        pb.builds[build].components.map(li => `<li>${li}</li>`).join("")
    );
    $(".theme-prices .examples-text").css("color", pb.style.text[0]);
    $(".pc-details .pay h3").css("color", pb.style.text[0]);
    $(".pc-details .price").text(pb.builds[build].price);
    if (type === 'd') {
        $(".pc-details").css("display", "flex")
    } else {
        $(".theme-prices").css("display", "flex");
    }
    $(".theme-prices .carousel-container").append(
        `
        <div class="pic-carousel glide">
            <div class="glide__track" data-glide-el="track">
                <ul class="glide__slides">
                    ${pb.pictures.map(pic => `
                    <li class="glide__slide">
                        <a data-fslightbox="theme-gallery" href="../pc-examples/${pic}.webp">
                            <div class="prebuild-pic lazy" data-bg="../pc-examples/${pic}.webp"></div>
                        </a>
                    </li>`).join("")}         
                </ul>
            </div>
            <div class="glide__arrows" data-glide-el="controls">
                <button class="glide__arrow glide__arrow--left arrow" data-glide-dir="<">
                    <img src="../global/left-arrow.svg" />
                </button>
                <button class="glide__arrow glide__arrow--right arrow" data-glide-dir=">">
                    <img src="../global/right-arrow.svg" />
                </button>
            </div>
            <div class="glide__bullets" data-glide-el="controls[nav]">
                ${pb.pictures.map((pic, index) => `
                    <button class="glide__bullet" data-glide-dir="=${index}"></button>
                `).join("")}
            </div>
        </div>
        `
    );

    $(".navbar").css('top', 'clamp(-120px, -4vw, -65px)');
    $("html").css("overflow", "hidden");
    window.addEventListener('touchmove', preventTouchScroll, { passive: false });

    gsap.fromTo($(".card"), {
        scale: 0,
    }, {
        scale: 1,
        duration: 0.2,
        ease: 'power4.out'
    });

    $(".pay button").hover(
        function() {
            gsap.to($(".pay img"), {
                x: '7rem',
                duration: 0.3,
                ease: "power2.out",
            })
        },
        function() {
            gsap.to($(".pay img"), {
                x: '0rem',
                duration: 0.3,
                ease: "power2.out",
            })
        }
    )
    
     refreshFsLightbox();
}

function changeComponenets(button, i, comps) {
    $(".theme-prices .buttons").children().each((index, button) => {
        $(button).css("font-weight", index === i ? 600 : 400);
        $(button).css("background", index === i ? "rgba(255, 255, 255, 0.7)" : "");
        $(button).css("scale", index === i ? "1.1" : "1");
        if (index === i) 
            $(button).addClass("active");
        else 
            $(button).removeClass("active");    
    });
    $(".theme-prices .info ul").html(
        comps.map(li => `<li>${li}</li>`).join("")
    );
}

