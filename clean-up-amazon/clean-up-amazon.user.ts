// ==UserScript==
// @name        Amazon Sponsored Ads Clean-up
// @namespace   https://userscripts.johnson.gg/
// @author      Michael Johnson
// @version     0.1.0
// @description Amazon Sponsored Ads Clean-up removes all of the sponsored or otherwise irrelevant ads from Amazon.
// @include     http*://www.amazon.cn/*
// @include     http*://www.amazon.in/*
// @include     http*://www.amazon.co.jp/*
// @include     http*://www.amazon.com.sg/*
// @include     http*://www.amazon.com.tr/*
// @include     http*://www.amazon.ae/*
// @include     http*://www.amazon.fr/*
// @include     http*://www.amazon.de/*
// @include     http*://www.amazon.it/*
// @include     http*://www.amazon.nl/*
// @include     http*://www.amazon.es/*
// @include     http*://www.amazon.co.uk/*
// @include     http*://www.amazon.ca/*
// @include     http*://www.amazon.com.mx/*
// @include     http*://www.amazon.com/*
// @include     http*://www.amazon.com.au/*
// @include     http*://www.amazon.com.br/*
// @include     http*://smile.amazon.com/*
// @run-at      document-start
// ==/UserScript==

type RemovalInformation = {
    name: string
    instanceSelector: string
    parentSelector?: string
}

const testing = false;

const toRemove: RemovalInformation[] = [
    {
        name: "Sponsored Result (Search Page)",
        instanceSelector: '[data-component-type="sp-sponsored-result"]',
        parentSelector: '[data-asin]'
    },
    {
        name: "Sponsored Suggestions (Item Page)",
        instanceSelector: '.sp_desktop_sponsored_label',
        parentSelector: '.a-carousel-container'
    },
    {
        name: "#desktop-ad-btf",
        instanceSelector: "#desktop-ad-btf"
    },
    {
        name: "#desktop-ad-center-1",
        instanceSelector: "#desktop-ad-center-1"
    },
    {
        name: "#desktop-banner",
        instanceSelector: "#desktop-banner"
    },
    {
        name: "#desktop-grid-1-D1",
        instanceSelector: "#desktop-grid-1-D1"
    },
    {
        name: "#desktop-grid-1-D2",
        instanceSelector: "#desktop-grid-1-D2"
    },
    {
        name: "#cr-ADPlaceholder",
        instanceSelector: "#cr-ADPlaceholder"
    },
    {
        name: "Remove banner ad at the top of the page",
        instanceSelector: "#percolate-ui-ilm_div"
    },
    {
        name: 'Remove sponsored results "based on your history"',
        instanceSelector: 'div#rhf-shoveler'
    },
    {
        name: ".vse-search-widget-container",
        instanceSelector: ".vse-search-widget-container"
    },
    {
        name: "Sponsored Banners (Top of Search Page)",
        instanceSelector: '[data-component-type="s-ads-metrics"]',
        parentSelector: 'div.a-section'
    },
    {
        name: "Sponsored Banners (Bottom of Search Page)",
        instanceSelector: 'div[cel_widget_id*="-brand-footer-"]',
        parentSelector: 'div.s-result-item'
    },
    {
        name: "Remove bad carousels",
        instanceSelector: 'span[cel_widget_id^="MAIN-FEATURED_ASINS"]',
        parentSelector: "div.s-result-item"
    },
    {
        name: ".threepsl",
        instanceSelector: ".threepsl"
    }
];

new MutationObserver(function() {
    // console.groupCollapsed("Amazon Sponsored Products Remover");
    // console.time("Sponsored Product Remover");

    for(const information of toRemove) {
        // console.group(information.name);

        // console.debug(`Selector: ${information.instanceSelector}`);
        // console.debug(`Parent selector: ${information.parentSelector}`);

        let removed = 0;

        document.querySelectorAll<HTMLElement>(information.instanceSelector).forEach(element => {
            const deletedBackgroundColor = 'rgb(233, 130, 116)';
            if(information.parentSelector == null) {
                if(!testing) {
                    // console.debug('Removed: ', element);

                    element.remove();
                } else {
                    // console.info('Would remove: ', element);

                    element.style.backgroundColor = deletedBackgroundColor;

                    if(element.dataset.removedBy == null) {
                        element.dataset.removedBy = "";
                    } else {
                        element.dataset.removedBy += ",";
                    }

                    element.dataset.removedBy += information.name;
                }

                removed += 1;
                return;
            }

            const parent = element.closest<HTMLElement>(information.parentSelector);
            if(parent === null) {
                // console.error(`Couldn't locate parent (${information.parentSelector}) of `, element);
                return;
            }


            if(!testing) {
                // console.debug('Removed: ', parent);

                parent.remove();
            } else {
                // // console.info('Would remove: ', parent);

                parent.style.backgroundColor = deletedBackgroundColor;

                if(parent.dataset.removedBy == null) {
                    parent.dataset.removedBy = "";
                } else {
                    parent.dataset.removedBy += ",";
                }

                parent.dataset.removedBy += information.name;
            }

            removed += 1;
        });

        if(removed > 0) {
            // console.info(`Removed ${removed} element${removed != 1 ? 's' : ''}`);
        } else {
            // console.info("Didn't find any elements to remove.")
        }

        // console.groupEnd();
    }

    // console.timeEnd("Sponsored Product Remover");
    // console.groupEnd();
}).observe(document.firstElementChild!, {childList: true, subtree: true});
