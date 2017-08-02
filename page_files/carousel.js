/*
 *
 * Product Page Carousel
 *
 */
Carousel = (function () {

    var $slidesWrapper = $(".carousel__slides");
    var $slides = $slidesWrapper.find(".carousel__slide");
    var $navWrapper = $(".carousel__nav");
    var $navIndicators = $navWrapper.find(".carousel__nav__indicator");
    var currentIndex = 0;
    var slideSpeed = 1000;

    var init = function () {
        // Set the height of the slideshow

        $slides.each(function (i) {
            $(this).attr("data-index", i);
            $($navIndicators[i]).attr("data-index", i);
        });

        // Set first slide to active
        $($slides[0])
            .addClass("active")
            .css({ right: 0 });

        $($navIndicators[0])
            .addClass("active");

        $slidesWrapper.
            height($($slides[0]).find("img").height());

        bindClick();
    };

    var bindClick = function () {
        $(document).on("click", ".carousel__nav__indicator", function () {
            previousIndex = currentIndex;
            currentIndex = $(this).data("index");

            slide();
            // Update the active nav tile icon
            $navWrapper.find("li.active").removeClass("active");
            $(this).addClass("active");
        });

        $(document).on("click", ".carousel__nav__previous, .carousel__nav__next", function () {
            previousIndex = currentIndex;

            var dir = this.className.split("_")[this.className.split("_").length - 1];
            if (dir === 'next') {
                currentIndex = currentIndex == $slides.length - 1 ? 0 : currentIndex + 1;
            } else {
                currentIndex = currentIndex === 0 ? $slides.length - 1 : currentIndex - 1;
            }

            slide();
            // Update the active nav tile icon
            $navWrapper.find("li.active").removeClass("active");
            $($navIndicators[currentIndex]).addClass("active");

        });
    };

    var slide = function () {
        if (currentIndex === 0 && previousIndex == $slides.length - 1) {
            hideSlide(true);
            showSlide(true);
        } else if (previousIndex === 0 && currentIndex == $slides.length - 1) {
            hideSlide();
            showSlide();
        } else if (previousIndex === currentIndex) {
            return;
        } else if (currentIndex > previousIndex) {
            hideSlide(true);
            showSlide(true);
        } else {
            hideSlide();
            showSlide();
        }
    };


    function hideSlide(reverse) {
        var $slide = $slidesWrapper.find(".active");
        if (!$slide.length) {
            return;
        }
        $slide.removeClass('active').animate({
            right: reverse ? '100%' : "-100%"
        }, {
            queue: false
        }, slideSpeed, function () {
            $slide.css('right', '');
        });
    }

    function showSlide(reverse) {
        var $slide = $($slides[currentIndex]);

        $slide.css({ right: "100%" });
        if (reverse) {
            $slide.css('right', '-100%');
        }
        $slide.animate({
            right: 0
        }, {
            queue: false
        }, slideSpeed).addClass("active");
    }


    return {
        init: init
    };
})();

$(window).load(function () {

    Carousel.init();
});
