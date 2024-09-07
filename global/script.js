




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
    const navUp = () => {
        $(".navbar").css('top', 'var(--nav-height)');
    }
    const navDown = () => {
        $(".navbar").css('top', '0');
    }

    //CURSOR FOLLOWER
    $(window).mousemove(function (e) { 
        gsap.to('.cursor-follower', {
            x: e.clientX - innerWidth / 2,
            y: e.clientY - innerHeight / 2,
            duration: 2,
            ease: 'sine.out',
        });
    });

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
    )


}
