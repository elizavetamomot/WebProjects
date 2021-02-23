let controller;
let slideScene;
let pageScene;
let detailScene;
const mouse = document.querySelector('.cursor');
const mouseText = document.querySelector('.cursor-text');
const burger = document.querySelector('.burger');

function animateSlides(){
    //Init Controller
    controller = new ScrollMagic.Controller();
    //
    const sliders = document.querySelectorAll('.slide');
    const nav = document.querySelector(".nav-header");
    //Loop over each slide
    sliders.forEach((slide, index, slides) => {
        const revealImg = slide.querySelector('.reveal-img');
        const img = slide.querySelector('img');
        const revealText = slide.querySelector('.reveal-text');
        //GSAP
        const slideTl = gsap.timeline({
            defaults: {
                duration: 1,
                ease: "power2.inOut"
            }
        });
        slideTl.fromTo(revealImg, {x: "0%"}, {x: "100%"});
        slideTl.fromTo(img, {scale: 2}, {scale: 1}, "-=1"); //-=1 start in the same time with revealImg
        slideTl.fromTo(revealText, {x: "0%"}, {x: "100%"}, "-=0.75");
        

        //Create scene
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25,
            reverse: false // The animation will stay put when scroll up
        }).setTween(slideTl)
        //   .addIndicators({
        //     colorStart: "white",
        //     colorTrigger: "white",
        //     name: "slide"
        // })
        .addTo(controller);
        //New animation
        const pageTl = gsap.timeline();
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        pageTl.fromTo(nextSlide, {y: "0%"}, {y: "50%"});
        pageTl.fromTo(slide, {opacity: 1, scale: 1},{opacity: 0, scale: 0.5});
        pageTl.fromTo(nextSlide, {y: "50%"}, {y: "0%"}, "-=0.5");
        //create new scene
        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: "100%",
            triggerHook: 0
        })
        // .addIndicators({
        //     colorStart: "white",
        //     colorTrigger: "white",
        //     name: "page",
        //     indent: 200
        // })
        .setPin(slide, {pushFollowers: false})
        .setTween(pageTl)
        .addTo(controller);
    });

}

function cursor(e){
    
    mouse.style.top = e.pageY + "px";
    mouse.style.left = e.pageX + "px";
}

function activeCursor(e){
    let item = e.target;
    
    if(item.id === 'logo' || item.classList.contains('burger')){
        mouse.classList.add('nav-active');
    }else{
        mouse.classList.remove('nav-active');
    }
    if(item.classList.contains('explore')){
        mouse.classList.add('explore-active');
        gsap.to(".title-swipe", 1, {y: "0%"});
        mouseText.innerText = 'Tap';
    }else{
        mouse.classList.remove('explore-active');
        gsap.to(".title-swipe", 1, {y: "100%"});
        mouseText.innerText = '';
    }

}

function navToggle(e){
    if(!e.target.classList.contains("active")){
        e.target.classList.add("active")
        gsap.to(".line1", 0.5, {rotate: "45", y: 5, background: "black"});
        gsap.to(".line2", 0.5, {rotate: "-45", y: -5, background: "black"});
        gsap.to('#logo', 1, {color: "black"});
        gsap.to(".nav-bar", 1, {clipPath: "circle(4500px at 100% -10%)"});
        document.body.classList.add('hide');
    }else{
        e.target.classList.remove("active")
        gsap.to(".line1", 0.5, {rotate: "0", y: 0, background: "white"});
        gsap.to(".line2", 0.5, {rotate: "0", y: 0, background: "white"});
        gsap.to('#logo', 1, {color: "white"});
        gsap.to(".nav-bar", 1, {clipPath: "circle(50px at 100% -10%)"});
        document.body.classList.remove('hide');
    }
}

//Barba Page Transitions
const logo = document.querySelector('#logo');
barba.init({
    views:[
        {
            namespace: "home",
            beforeEnter() {
                animateSlides();
                logo.href = './index.html';
                
            },
            afterLeave(){
                slideScene.destroy();
                pageScene.destroy();
                controller.destroy();
                
            }
        },
        {
            namespace: "fashion",
            beforeEnter(){
                logo.href = "../index.html";
                detailAnimaton();
            },
            beforeLeave() {
              controller.destroy();
              detailScene.destroy();
            }
        }
    ],
    transitions: [
        {
            leave({current,next}){
                let done = this.async();
                //animation
                const tl = gsap.timeline({defaults: {ease: "power2.Out"}});
                tl.fromTo(current.container, 1, {opacity: 1}, {opacity: 0});
                tl.fromTo(".swipe", 0.75, {x: "-100%"}, {x: "0%", onComplete: done}, "-=0.5");
            },
            enter({current,next}){
                let done = this.async();
                //scroll to the top
                window.scrollTo(0,0);
                //animation
                const tl = gsap.timeline({defaults: {ease: "power2.Out"}});
                tl.fromTo(".swipe", 0.75, {x: "0%"}, {x: "100%", stagger: 0.25 , onComplete: done}, "-=0.5");
                tl.fromTo(next.container, 1, {opacity: 0}, {opacity: 1});
                tl.fromTo('.nav-header', 1, {y: '-100%'}, {y: '0%', ease: 'power2.inOut'});
            }
        }
    ]
})

function detailAnimaton(){
    controller = new ScrollMagic.Controller();
    const slides = document.querySelectorAll('.detail-slide');
    slides.forEach((slide, index,slides) => {
        const slideTl = gsap.timeline({defaults: {duration:1}});
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        const nextImg = nextSlide.querySelector("img");
        slideTl.fromTo(slide, {opacity: 1}, {opacity: 0});
        slideTl.fromTo(nextSlide, {opacity: 0}, {opacity: 1}, "-=1");
        slideTl.fromTo(nextImg, {x: "50%"}, {x: "0%"});
        //scene
        detailScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%',
            triggerHook: 0
        }).setPin(slide, {pushFollowers: false})
          .setTween(slideTl)
          .addTo(controller);
    });
}

window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);
burger.addEventListener('click', navToggle);
window.addEventListener('DOMContentLoaded', function(){
    $.notify(
        "You can click on 'Explore' at the last section ", 
        { 
            position:"right bottom",
            autoHideDelay: 7000,
            style: 'custom',
            className: 'base'
        }
    );
});    
$.notify.addStyle('custom', {
    html: "<div><span data-notify-text/></div>",
    classes: {
      base: {
        "white-space": "nowrap",
        "background-color": "#17181a",
        "padding": "15px",
        "font-size": "25px",
        "color": "white",
        "border": "1px solid white",
        "border-radius" : "55px"
      }
    }
  });