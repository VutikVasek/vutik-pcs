$(document).ready(function(e){
    $(window).scrollTop(0);
    window.scrollTo(0, 0);

    
    //LOADING PREBUILDS
    

    fetch('../global/prebuilds.json')
        .then(response => response.json())
        .then(data => {
            const prebuilds = `
                ${data.prebuilds.map(prebuild => `
                    <div class="prebuild">
                        <div class="name">
                            <h3>${prebuild.name}</h3>
                            <p>${prebuild.description}</p>
                        </div>
                        <div class="pic-carousel glide">
                            <div class="glide__track" data-glide-el="track">
                                <ul class="glide__slides">
                                    ${prebuild.pictures.map(pic => `
                                    <li class="glide__slide">
                                        <a data-fslightbox="${prebuild.key}" href="../pc-examples/${pic}.webp">
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
                                ${prebuild.pictures.map((pic, index) => `
                                    <button class="glide__bullet" data-glide-dir="=${index}"></button>
                                `).join("")}
                            </div>
                        </div>
                        <div class="info">
                            <div class="stats">
                                ${data.statNames.map((stat, index) => `
                                    <div class="stat">
                                        <p>${stat}</p>
                                        <div class="bar" data-percentage="${prebuild.stats[stat]}">
                                            <div style="background: ${prebuild.style.accent}"></div>
                                        </div>
                                    </div>
                                `).join("")}

                            </div>
                            <div class="prices">
                                ${prebuild.builds.map((build, index) => `
                                    <button onclick="openDetails('${prebuild.key}', ${index})" style="
                                        color: ${prebuild.style.text[index]}; 
                                        background: linear-gradient(to right,
                                            ${prebuild.style.dark} ${-index*100}%,
                                            ${prebuild.style.light} ${300 - (index * 100)}%);
                                        border: ${prebuild.style.border};
                                    ">${build.price}</button>
                                `).join("").replace(/\s+/g, ' ')}
                            </div>
                        </div>
                    </div>
                    `
                ).join("")}
            `;
            $(".showcase").append(prebuilds);
            
            //console.log(data.prebuilds.map(prebuild => prebuild.pictures.map(pic => `"../Home/resources/prebuilds/${prebuild.key}/examples/${pic}"`).join(",")).join(","));
              
        })
        .catch(error => console.error('Error fetching JSON:', error))
        .finally(() => {
            refreshFsLightbox();

            //LOGO ANIMATION
            const animateGrad = (num, percent) => {
                gsap.fromTo(`.text-grad-${num}`, {
                    backgroundPosition: $(`.text-grad-${num}`).css("background-position-x"),
                }, {
                    backgroundPosition: `${percent}%`,
                    duration: 0.5,
                    ease: "power2.inOut"
                });
            }

            $('.text-grad-1').hover(
                function() { animateGrad(1, 0); },
                function() { animateGrad(1, 100); }
            )

            $('.text-grad-2').hover(
                function() { animateGrad(2, 0); },
                function() { animateGrad(2, 100); }
            )

            setTimeout(() => {
                animateGrad(1, 100);
                setTimeout(() => {
                    animateGrad(2, 100);
                    //INTRO ARROW 
                    gsap.to(".intro svg", {
                        bottom: '30rem',
                        ease: CustomEase.create("custom", "M0,0 C0.333,1.333 0.666,1.333 1,0 "),//CustomEase.create("custom", "M0,0 C0,0.5 0.3,0.8 0.5,0.8 0.7,0.8 1,0.5 1,0 "),
                        duration: 1,
                    })
                }, 300);
            }, 500);

            //SCROLL ANIMATIONS
                // disclaimer
            const disclaimer = $(".disclaimer .background")

            const disclaimerGrad = gsap.to(disclaimer, {
                x: '50%',
                ease: "sine.out"
            });

            ScrollTrigger.create({
                trigger:".disclaimer",
                start: "bottom bottom",
                end: "top center",
                animation: disclaimerGrad,
                scrub: 1,
                invalidateOnRefresh: true,
                markers: false
            })

                // horizontal
            const showcase = $(".showcase");

            const getScrollAmount = () => {
                const amount = -(showcase.outerWidth() - window.innerWidth);
                return (amount > 0) ? 0 : amount;
            }

            const horizontal = gsap.to(showcase, {
                x: getScrollAmount,
                duration: 3,
                ease: "sine.inOut",
            });

            ScrollTrigger.create({
                trigger:".showcase-wrapper",
                start: "top 0%",
                end: () => `+=${ -1 * getScrollAmount()}`,
                pin: true,
                animation: horizontal,
                scrub: 1,
                invalidateOnRefresh: true,
                markers: false
            })

            let lastScrollTop = 0;

            $(window).scroll(function(e) {
                let currentScrollTop = $(this).scrollTop();

                if (currentScrollTop < lastScrollTop && (horizontal.progress() <= 0.05 || window.matchMedia("(max-aspect-ratio: 1/1)").matches) || currentScrollTop < 10) {
                    // Scroll Up - show navbar
                    $('.navbar').css('top', '0');
                }
                else if (currentScrollTop > lastScrollTop || horizontal.progress() > 0.05) {
                    // Scroll Down - hide navbar
                    $('.navbar').css('top', 'var(--nav-height)');
                    $(".menu-phone .menu").hide('hidden');
                    if (currentScrollTop + window.innerHeight >= $(document).height()) {
                        $('.navbar').css('top', '0');
                    }
                } 
                lastScrollTop = currentScrollTop;

                //main pc parallax;
                if (!window.matchMedia("(max-aspect-ratio: 1.2/1)").matches)
                    $(".parallax").css("transform", `translate(0%, ${currentScrollTop * 0.5}px)`);
            });

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

            //STAT BARS
            $(".stat .bar").each(function () { 
                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if(entry.isIntersecting) {
                            gsap.to($(this).children(), {
                                width: `${this.dataset.percentage}%`,
                                ease: "power3.out",
                                delay: 0.5
                            });
                        }
                    })
                });

                observer.observe(this);
            });

            
        ScrollTrigger.refresh();

        importedLocal = true;
        afterImport("local");
    });

});

function afterImport(from) {
    if (importedLocal && importedGlobal) {
        ScrollTrigger.refresh();
        $(window).scrollTop(0);
    }
    $(window).scrollTop(0);
    ScrollTrigger.refresh();
}

$(window).on("resize", function () {
    $(".pc-details").css("height", window.innerHeight + "px");
    ScrollTrigger.refresh();
    //$(window).scrollTop(0);
    ScrollTrigger.refresh();
});


function preventTouchScroll(event) {
    event.preventDefault();
}
    
//open
function openDetails(theme, price) {
    openFrame(`../generator/?theme=${theme}&type=prebuild&price=${price}`);
}