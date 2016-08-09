/**
 * Created by allin_000 on 07.08.2016.
 */
angular
.module('modal-dsr', [])
.directive('modalDsr', ['$document', function($document) {
    return {
        restrict: 'EA',
        templateUrl: "src/dsr.html",
        scope: {},
        link: function(scope, element, attrs, controllers) {
            //console.log(scope);
            //console.log(element);
            //console.log(attrs);
            //console.log(controllers);

            var settings = {
                delta: 10
            };

            var selectedFunction ='default';


            var dragItem = element[0];

            var coords;
            var size;
            var shiftX;
            var shiftY;

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

            function getSize(elem){
                var box = elem.getBoundingClientRect();
                return {
                    width:  box.width,
                    height: box.height
                }
            }

            function setUpSelectedFunction(type){
                selectedFunction = type;
                dragItem.style.cursor = type;
            }

            var functionSelection = function(e){

                coords = getCoords(dragItem);
                size   = getSize(dragItem);
                shiftX = e.pageX - coords.left;
                shiftY = e.pageY - coords.top;


                var positionObject = {
                    leftCorner:        shiftX<settings.delta,
                    topCorner:         shiftY<settings.delta,
                    rightCorner:       Math.abs(size.width-shiftX)  < settings.delta,
                    bottomCorner:      Math.abs(size.height-shiftY) < settings.delta
                };

                if (shiftX>settings.delta && size.width  > (settings.delta+shiftX) &&
                    shiftY>settings.delta && size.height > (settings.delta+shiftY)){
                    setUpSelectedFunction('move');
                }
                else if (positionObject.leftCorner   && positionObject.topCorner){
                    setUpSelectedFunction('nwse-resize');
                }
                else if (positionObject.rightCorner  && positionObject.topCorner){
                    setUpSelectedFunction('nesw-resize');
                }
                else if (positionObject.leftCorner   && positionObject.bottomCorner){
                    setUpSelectedFunction('nesw-resize');
                }
                else if (positionObject.bottomCorner && positionObject.rightCorner){
                    setUpSelectedFunction('nwse-resize');
                }
                else if (positionObject.leftCorner){
                    setUpSelectedFunction('ew-resize');
                }
                else if (positionObject.topCorner){
                    setUpSelectedFunction('ns-resize');
                }
                else if (positionObject.rightCorner){
                    setUpSelectedFunction('ew-resize');
                }
                else if (positionObject.bottomCorner){
                    setUpSelectedFunction('ns-resize');
                }
                else {
                    setUpSelectedFunction('default');
                }

                scope.$apply(attrs.modalDsr);
            };

            function drag(e){

                coords = getCoords(dragItem);
                size   = getSize(dragItem);
                shiftX = e.pageX - coords.left;
                shiftY = e.pageY - coords.top;

                if (Math.abs(size.width-shiftX)<settings.delta || (Math.abs(size.width-shiftX) > size.width-settings.delta && Math.abs(size.width-shiftX) < size.width + settings.delta )){
                    console.log(size);
                    console.log(shiftX);
                }

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

                $document.on('ondragstart', function() {return false});
            }

            var modalFunction = function(e) {
                functionSelection(e);
                switch (selectedFunction){
                    case 'move':
                        drag(e);
                        break;
                    case 'nwse-resize':
                        break;
                    case 'nesw-resize':
                        break;
                    case 'ew-resize':
                        break;
                    case 'ns-resize':
                        break;
                    default:
                        console.log(selectedFunction);
                        break;
                }

            };

            dragItem.ondragstart = function() {
                return false;
            };



            element.on('mousemove', functionSelection);
            $document.on('mousedown',   modalFunction);
            $document.on('mouseover',   functionSelection);
            $document.on('mouseleave',  functionSelection);

            //$document.on('mouseup'  ,   $document.off('ondragstart', function() {return false}));
        }
    };
}]);

