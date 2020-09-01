function searchMovie() {
    var e = $("input[name=keyword]").val();
    "" !== e.trim() && (e = e.replace(/(<([^>]+)>)/gi, "").replace(/[`~!@#$%^&*()_|\=?;:'",.<>\{\}\[\]\\\/]/gi, ""), e = e.split(" ").join("+"), window.location.href = base_url + "search/" + e + ".html")
}

function validateEmail(e) {
    var t = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return e.length > 0 && t.test(e)
}

function subscribe() {
    if (!$.cookie("y-subscribed")) {
        $("#error-subscribe").hide();
        var e = $("#subscribe-email").val();
        "" == e.trim() ? ($("#error-subscribe").text("Please enter your email."), $("#error-subscribe").show()) : validateEmail(e) ? ($("#subscribe-submit").prop("disabled", !0), $("#subscribe-loading").show(), $.ajax({
            url: base_url + "ajax/subscribe.html",
            type: "POST",
            dataType: "json",
            data: {
                email: e
            },
            success: function(e) {
                1 == e.status && ($.cookie("y-subscribed", 1, {
                    expires: 365
                }), $("#success-subscribe").show()), $("#subscribe-email").val(""), $("#subscribe-loading").hide(), $("#subscribe-submit").removeAttr("disabled")
            }
        })) : ($("#error-subscribe").text("Please enter a valid email."), $("#error-subscribe").show())
    }
}

function initQtip() {
    $(".ml-mask").qtip({
        content: {
            text: function(e, t) {
                $.ajax({
                    url: base_url + t.elements.target.attr("data-url") + "?is_login=" + is_login,
                    type: "GET",
                    loading: !1,
                    success: function(e, i) {
                        t.set("content.text", e)
                    }
                })
            },
            title: function(e, t) {
                return $(this).attr("title")
            }
        },
        position: {
            my: "top left",
            at: "top right",
            viewport: $(window),
            target: "mouse",
            adjust: {
                mouse: !1
            },
            show: {
                effect: function(e) {
                    $(this).slideDown(200)
                }
            }
        },
        hide: {
            fixed: !0
        },
        style: {
            classes: "qtip-dark",
            width: 320,
            tip: {
                corner: !1
            }
        }
    })
}

function go_request_page() {
    is_login ? window.location.href = base_url + "request.html" : $("#pop-auth").modal("show")
}

function get_notify() {
    0 == $("#list-notify .notify-item").length && $.ajax({
        url: base_url + "ajax/user_get_notify.html",
        type: "GET",
        dataType: "json",
        success: function(e) {
            1 == e.status && ($("#notify-loading").remove(), $("#list-notify").html(e.html), 0 == parseInt(e.notify_unread) && $(".feed-number").remove())
        }
    })
}

function favorite(e, t) {
    is_login ? $.ajax({
        url: base_url + "ajax/user_favorite.html",
        method: "POST",
        data: {
            movie_id: e
        },
        dataType: "json",
        success: function(i) {
            if (1 == i.status) switch (t) {
                case "cluetip":
                    $(".favorite-" + e).hasClass("favorite") ? ($(".favorite-" + e).removeClass("favorite"), $(".favorite-" + e).text("Add to favorite")) : ($(".favorite-" + e).addClass("favorite"), $(".favorite-" + e).text("Remove from favorite"));
                    break;
                case "watch":
                    $("#favorite-alert").show(), $("#favorite-message").html(i.message), setTimeout(function() {
                        $("#favorite-alert").hide()
                    }, 5e3), $(".bp-btn-like").hasClass("active") ? $(".bp-btn-like").removeClass("active") : $(".bp-btn-like").addClass("active");
                    break;
                case "detail":
                    $(".btn-favorite").hasClass("active") ? $(".btn-favorite").removeClass("active") : $(".btn-favorite").addClass("active")
            }
        }
    }) : $("#pop-auth").modal("show")
}

function movies_by_genre(e) {
    $("#latest-" + e).is(":empty") && $.ajax({
        url: base_url + "ajax/movies_by_genre/" + e + ".html",
        type: "GET",
        dataType: "json",
        success: function(t) {
            $("#latest-" + e).html(t.html)
        }
    })
}

function movies_by_top(e) {
    $("#top-" + e).is(":empty") && $.ajax({
        url: base_url + "ajax/movies_by_top/" + e + ".html",
        type: "GET",
        dataType: "json",
        success: function(t) {
            $("#top-" + e).html(t.html)
        }
    })
}

function movies_by_country(e) {
    $("#latest-" + e).is(":empty") && $.ajax({
        url: base_url + "ajax/movies_by_country/" + e + ".html",
        type: "GET",
        dataType: "json",
        success: function(t) {
            $("#latest-" + e).html(t.html)
        }
    })
}

function movie_update_view() {
    $.cookie("y-view-" + movie.id) || $.ajax({
        url: base_url + "ajax/movie_update_view.html",
        type: "POST",
        dataType: "json",
        data: {
            id: movie.id
        },
        success: function(e) {
            var t = new Date,
                i = 5;
            t.setTime(t.getTime() + 60 * i * 1e3), $.cookie("y-view-" + movie.id, !0, {
                expires: t,
                path: "/"
            })
        }
    })
}

function movie_rate_info() {
    $.get(base_url + "ajax/movie_rate_info/" + movie.id + ".html", function(e) {
        $(".mv-rating").html(e)
    })
}

function movie_check_favorite(e) {
    $.get(base_url + "ajax/movie_check_favorite/" + e + "/" + movie.id + ".html", function(t) {
        if ($("#btn-favorite").html(t), "watch" == e && !$.cookie("y-notice-favorite-" + movie.id) && $(".popover-like").length > 0 && ("series" == movie.type || "HD" !== movie.quality)) {
            $.cookie("y-notice-favorite-" + movie.id, !0, {
                expires: 3
            }), $(".popover-like").show();
            var i = "series" == movie.type ? "Get updated once new episode is available. Favorite this now." : "Get updated once this movie is available in HD. Favorite this now.";
            $("#popover-notice").text(i), $(".toggle-popover-like").click(function() {
                $(".popover-like").hide()
            })
        }
    })
}

function movie_quick_play() {
    $.get(base_url + "ajax/v2_movie_quick_play/" + movie.slug + "/" + movie.id + "/" + movie.type + ".html", function(e) {
        $(".btn-watch-area").html(e)
    })
}

function movie_related() {
    $.get(base_url + "ajax/movie_related/" + movie.id + "/" + movie.type + ".html", function(e) {
        $("#movies-related").html(e)
    })
}

function news_update_view(e) {
    $.cookie("view-news-" + e) || $.ajax({
        url: base_url + "ajax/news_update_view.html",
        type: "POST",
        dataType: "json",
        data: {
            id: e
        },
        success: function(t) {
            var i = new Date,
                s = 2;
            i.setTime(i.getTime() + 60 * s * 2e3), $.cookie("view-news-" + e, !0, {
                expires: i
            })
        }
    })
}


$(document).ready(function() {
    function e() {
        $(this).find(".sub-container").css("display", "block")
    }

    function t() {
        $(this).find(".sub-container").css("display", "none")
    }

    function i() {
        var e = Math.random().toString(36).substring(18);
        return $.cookie("search_token", e, {
            path: "/"
        }), e
    }

    function s(e) {
        var t = i(),
            s = md5(e + t);
        e.trim().length > 2 ? $.ajax({
            url: base_url + "ajax/movie_suggest_search.html",
            type: "POST",
            dataType: "json",
            data: {
                keyword: e,
                hash: s
            },
            success: function(e) {
                $(".search-suggest").html(e.content), "" !== e.content.trim() ? $(".search-suggest").show() : $(".search-suggest").hide()
            }
        }) : $(".search-suggest").hide()
    }
    if ($.ajax({
            url: "/ajax/user_get_state.html",
            type: "GET",
            dataType: "json",
            success: function(e) {
                $("#top-user").html(e.content), 1 == e.is_login && (is_login = !0, $("#auth-modal").remove())
            }
        }), $("#search a.box-title").click(function(e) {
            $("#search .box").toggleClass("active")
        }), $("#toggle-xsidebar").click(function(e) {
            $("#xsidebar").toggleClass("active"), $("#toggle-xsidebar").toggleClass("active")
        }), $(".mobile-menu").click(function(e) {
            $("#menu,.mobile-menu").toggleClass("active"), $("#search, .mobile-search").removeClass("active")
        }), $(".mobile-search").click(function(e) {
            $("#search,.mobile-search").toggleClass("active"), $("#menu, .mobile-menu").removeClass("active")
        }), $(".filter-toggle").click(function(e) {
            $("#filter").toggleClass("active"), $(".filter-toggle").toggleClass("active")
        }), $(".bp-btn-light").click(function(e) {
            $(".bp-btn-light, #overlay, #media-player, #main").toggleClass("active")
        }), $("#overlay").click(function(e) {
            $(".bp-btn-light, #overlay, #media-player, #main").removeClass("active")
        }), $(".bp-btn-auto").click(function(e) {
            $(".bp-btn-auto").toggleClass("active")
        }), $("#toggle, .cac-close").click(function(e) {
            $("#comment").toggleClass("active")
        }), $("#toggle-login").click(function() {
            $("#tab-login").click()
        }), $("#toggle-register").click(function() {
            $("#tab-register").click()
        }), $(".top-menu> li").bind("mouseover", e), $(".top-menu> li").bind("mouseout", t), $(function() {
            function e() {
                var e = $(this),
                    t = e.find(".modal-dialog");
                e.css("display", "block"), t.css("margin-top", Math.max(0, ($(window).height() - t.height()) / 2))
            }
            $(".modal").on("show.bs.modal", e), $(window).on("resize", function() {
                $(".modal:visible").each(e)
            })
        }), $("#slider").length > 0) {
        new Swiper("#slider", {
            pagination: ".swiper-pagination",
            paginationClickable: !0,
            loop: !0,
            autoplay: 4e3
        })
    }
    $(".xlist, .pw-comment .content").perfectScrollbar(), $("#pop-trailer").on("shown.bs.modal", function() {
        $("#iframe-trailer").attr("src", movie.trailer)
    }), $("#pop-trailer").on("hide.bs.modal", function() {
        $("#iframe-trailer").attr("src", "")
    }), $("#login-form").submit(function(e) {
        $("#login-submit").prop("disabled", !0), $("#login-loading").show();
        var t = $(this).serializeArray();
        $.ajax({
            url: base_url + "ajax/user_login.html",
            type: "POST",
            data: t,
            dataType: "json",
            success: function(e) {
                0 == e.status && ($("#error-message").show(), $("#error-message").text(e.message), $("#login-submit").removeAttr("disabled"), $("#login-loading").hide()), 1 == e.status && window.location.reload()
            }
        }), e.preventDefault()
    }), $("#register-form").submit(function(e) {
        $("#register-submit").prop("disabled", !0), $("#register-loading").show(), $(".error-message").hide();
        var t = $(this).serializeArray();
        $.ajax({
            url: base_url + "ajax/user_register.html",
            type: "POST",
            data: t,
            dataType: "json",
            success: function(e) {
                if ($(".error-message").hide(), 0 == e.status) {
                    for (var t in e.messages) $("#error-" + t).show(), $("#error-" + t).text(e.messages[t]);
                    $("#register-submit").removeAttr("disabled"), $("#register-loading").hide()
                }
                1 == e.status && window.location.reload()
            }
        }), e.preventDefault()
    }), $("#request-form").submit(function(e) {
        $("#request-submit").prop("disabled", !0), $("#request-loading").show();
        var t = $(this).serializeArray();
        $.ajax({
            url: base_url + "ajax/user_request.html",
            type: "POST",
            data: t,
            dataType: "json",
            success: function(e) {
                1 == e.status && ($("#message-success").show(), setTimeout(function() {
                    $("#message-success").hide()
                }, 5e3), document.getElementById("request-form").reset()), $("#request-submit").removeAttr("disabled"), $("#request-loading").hide()
            }
        }), e.preventDefault()
    }), $("#profile-form").submit(function(e) {
        $("#btn-update").prop("disabled", !0), $("#submit-loading").show();
        var t = new FormData(this);
        $.ajax({
            url: base_url + "ajax/user_update.html",
            type: "POST",
            data: t,
            dataType: "json",
            mimeType: "multipart/form-data",
            contentType: !1,
            processData: !1,
            cache: !1,
            success: function(e) {
                if ($(".error-message").hide(), 0 == e.status) {
                    for (var t in e.messages) $("#error-" + t).show(), $("#error-" + t).text(e.messages[t]);
                    $("#btn-update").removeAttr("disabled"), $("#submit-loading").hide()
                }
                1 == e.status && window.location.reload()
            }
        }), e.preventDefault()
    });
    var a = !0;
    $(".search-suggest").mouseover(function() {
        a = !1
    }), $(".search-suggest").mouseout(function() {
        a = !0
    }), $("input[name=keyword]").keyup(function() {
        var e = $(this).val();
        s(e)
    }), $("input[name=keyword]").blur(function() {
        a && $(".search-suggest").hide()
    }), $("input[name=keyword]").focus(function() {
        "" !== $(".search-suggest").html() && $(".search-suggest").show()
    }), $("input[name=keyword]").keypress(function(e) {
        13 == e.which && searchMovie()
    }), $("#forgot-form").submit(function(e) {
        $("#forgot-form").prop("disabled", !0);
        var t = $(this).serializeArray();
        $.ajax({
            url: base_url + "ajax/user_forgot",
            type: "POST",
            data: t,
            dataType: "json",
            success: function(e) {
                0 == e.status && ($("#forgot-error-message").show(), $("#forgot-error-message").text(e.message)), 1 == e.status && ($("#forgot-success-message").show(), $("#forgot-success-message").text(e.message)), $("#forgot-submit").removeAttr("disabled")
            }
        }), e.preventDefault()
    })
});