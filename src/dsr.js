/**
 * Created by allin_000 on 07.08.2016.
 */
angular
.module('modal-dsr', [])
.directive('modalDsr', function() {
    return {
        restrict: 'E',
        templateUrl: "src/dsr.html",
        scope: {},
        link: function(scope, element, attrs, controllers) {
            console.log(scope);
            console.log(element);
            console.log(attrs);
            console.log(controllers);

            var dragItem = element[0];

            function getCoords(elem) {
                // (1)
                var box = elem.getBoundingClientRect();

                var body = document.body;
                var docEl = document.documentElement;

                // (2)
                var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
                var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

                // (3)
                var clientTop = docEl.clientTop || body.clientTop || 0;
                var clientLeft = docEl.clientLeft || body.clientLeft || 0;

                // (4)
                var top  = box.top +  scrollTop - clientTop;
                var left = box.left + scrollLeft - clientLeft;

                // (5)
                return { top: Math.round(top), left: Math.round(left) };
            }

            dragItem.onmousedown = function(e) {

                var coords = getCoords(dragItem);
                var shiftX = e.pageX - coords.left;
                var shiftY = e.pageY - coords.top;

                dragItem.style.position = 'absolute';
                document.body.appendChild(dragItem);
                moveAt(e);

                dragItem.style.zIndex = 1000; // над другими элементами

                function moveAt(e) {
                    dragItem.style.left = e.pageX - shiftX + 'px';
                    dragItem.style.top = e.pageY - shiftY + 'px';
                }

                document.onmousemove = function(e) {
                    moveAt(e);
                };

                dragItem.onmouseup = function() {
                    document.onmousemove = null;
                    dragItem.onmouseup = null;
                };

            };

            dragItem.ondragstart = function() {
                return false;
            };

        }
    };
});

