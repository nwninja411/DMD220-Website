document.addEventListener("DOMContentLoaded", function(){

    let nav = document.querySelector("nav");

    function updateNav(){
        if(!nav){ return; }
        if(window.scrollY > 50){
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    }

    updateNav();
    window.addEventListener("scroll", updateNav);

    /* FILTER SYSTEM */
    let btnFilters = document.querySelectorAll(".FilterBtn");
    let divGalleryItems = document.querySelectorAll("#Gallery .GalItem");

    if(btnFilters.length > 0 && divGalleryItems.length > 0){

        function applyFilter(category){
            let selectedCategory = category.toLowerCase();

            divGalleryItems.forEach(function(item){
                let itemCategory = item.dataset.category.toLowerCase();
                if (selectedCategory === "all" || itemCategory === selectedCategory){
                    item.classList.remove("hidden");
                } else {
                    item.classList.add("hidden");
                }
            });
        }

        btnFilters.forEach(function(button){
            button.addEventListener("click", function(){

                btnFilters.forEach(function(btn){
                    btn.classList.remove("active");
                });

                button.classList.add("active");
                applyFilter(button.dataset.category);
            });
        });

        btnFilters.forEach(function(btn){ btn.classList.remove("active"); });
        if(btnFilters[0]){ btnFilters[0].classList.add("active"); }
        applyFilter("All");
    }

    /* LIGHTBOX */
    const lightbox = document.getElementById("Lightbox");
    const lightboxImg = document.getElementById("LightboxImg");
    const closeBtn = document.getElementById("LightboxClose");

    document.querySelectorAll(".LightboxLink").forEach(link => {
        link.addEventListener("click", function(e){
            e.preventDefault();
            lightboxImg.src = this.href;
            lightbox.classList.add("active");
        });
    });

    closeBtn.addEventListener("click", () => {
        lightbox.classList.remove("active");
    });

    lightbox.addEventListener("click", (e) => {
        if(e.target === lightbox){
            lightbox.classList.remove("active");
        }
    });

});

const hamburger = document.getElementById("Hamburger");
const navLinks = document.getElementById("NavLinks");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

/* HERO VIDEO OPTIMIZATION */
const heroVideo = document.getElementById("HeroVideo");

if(heroVideo){

    const observer = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                heroVideo.play();
            } else {
                heroVideo.pause();
            }
        });
    },{
        threshold: 0.25
    });

    observer.observe(heroVideo);
}

/* FILM GRAIN TRANSITION (SEAMLESS FEEL) */
document.addEventListener("DOMContentLoaded", function(){

    const transition = document.getElementById("FilmTransition");
    const grainVideo = document.getElementById("GrainVideo");

    /* Here I am fading OUT only if we are arriving from another internal page */
    if(sessionStorage.getItem("filmTransition") === "1"){
        sessionStorage.removeItem("filmTransition");

        if(grainVideo){
            const playPromise = grainVideo.play();
            if(playPromise){ playPromise.catch(()=>{}); }
        }

        /* Let the browser paint one frame with the overlay ON, then fade it out */
        requestAnimationFrame(()=>{
            requestAnimationFrame(()=>{
                document.documentElement.classList.remove("is-transitioning");
            });
        });
    }

    /* Here I am intercepting internal links so we can play the transition before leaving */
    document.querySelectorAll("a").forEach(link=>{
        const url = link.getAttribute("href");
        if(!url) return;

        const isExternal = url.startsWith("http") || url.startsWith("mailto:");
        const isAnchor = url.startsWith("#");

        if(isExternal || isAnchor) return;

        link.addEventListener("click", function(e){
            e.preventDefault();

            sessionStorage.setItem("filmTransition", "1");
            document.documentElement.classList.add("is-transitioning");

            if(grainVideo){
                const playPromise = grainVideo.play();
                if(playPromise){ playPromise.catch(()=>{}); }
            }

            setTimeout(()=>{
                window.location.href = url;
            }, 220);
        });
    });

});
