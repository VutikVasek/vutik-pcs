

let importedGlobal = false;
let importedLocal = false;


$(document).ready(function () {
    
    $.get('../global/navbar.html', function(data) {
    
        $('body').prepend(data);
    
        //MENU FOR PHONE
        $(".menu-phone").click(function() {
            $(this).children(".menu").toggle('hidden');
        })
    
        
        
        $.get('../global/footer.html', function(data) {
            
            $('body').append(data);

            doStuff();
    
        }).fail(function() {
            console.error('Failed to load external content.');
        });
    }).fail(function() {
        console.error('Failed to load external content.');
    });
});


function doStuff() {
    //NAVBAR
    $(".navbar").css("width", document.body.clientWidth + 'px');
    $(window).resize(function () { 
        $(".navbar").css("width", document.body.clientWidth + 'px');
    });

    //CURSOR FOLLOWER
    let mouseX = 0, mouseY = 0;
    $(window).mousemove(function (e) { 
        mouseX = e.clientX;
        mouseY = e.clientY;
        /*gsap.to('.cursor-follower', {
            x: e.clientX - innerWidth / 2,
            y: e.clientY - innerHeight / 2,
            duration: 2,
            ease: 'power2.out',
        });*/
        /*$('.cursor-follower').css({
            left: e.pageX + 'px',
            top: e.pageY + 'px',
            duration: 2000
        });*/
    });
    function animate() {
        $('.cursor-follower').css({
            'transform': `translate(${mouseX - innerWidth / 2}px, ${mouseY - innerHeight / 2}px)`
        });
        requestAnimationFrame(animate);
    }

    animate();



    // MAIN BUTTONS HOVER
    const buttonHover = b => {
        gsap.to(b, {
            '--tint': '20%',
            y: '-5rem',
            duration: 0.5,
            ease: "power3.out"
        });
    }

    const buttonOut = b => {
        gsap.to(b, {
            "--tint": '50%',
            y: '0rem',
            duration: 0.5,
            ease: "power3.out"
        });
    }

    $("button.main").hover(
        function() {
            buttonHover($(this))
        },
        function() {
            buttonOut($(this))
        }
    );

    ScrollTrigger.refresh();

    importedGlobal = true;
    afterImport("global");
}
