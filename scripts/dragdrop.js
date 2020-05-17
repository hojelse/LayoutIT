// Credit to Rudi Szabó (modified)
// https://codepen.io/szrudi/details/gOpLyKd

//Script til at kunne flytte billeder.

initDragAndDrop();

function initDragAndDrop() {    
    let draggables = document.querySelectorAll(".draggable");
    let dropZones = document.querySelectorAll(".drop-zone");
    initDraggables(draggables);
    initDropZones(dropZones);
}

function initDraggables(draggables) {
    for (const draggable of draggables) {
        initDraggable(draggable);
    }
}

function initDropZones(dropZones) {
    for (let dropZone of dropZones) {
        initDropZone(dropZone);
    }
}

function initDraggable(draggable) {
    draggable.addEventListener("dragstart", dragStartHandler);
    draggable.addEventListener("drag", dragHandler);
    draggable.addEventListener("dragend", dragEndHandler);
    draggable.setAttribute("draggable", "true");
}

function initDropZone(dropZone) {
    dropZone.addEventListener("dragenter", dropZoneEnterHandler);
    dropZone.addEventListener("dragover", dropZoneOverHandler);
    dropZone.addEventListener("dragleave", dropZoneLeaveHandler);
    dropZone.addEventListener("drop", dropZoneDropHandler);    
}

function dragStartHandler(e) {
    setDropZonesHighlight();
    this.classList.add('dragged', 'drag-feedback');
    e.dataTransfer.setData("type/dragged-box", 'dragged');
    e.dataTransfer.setData("text/plain", this.textContent.trim());   
    deferredOriginChanges(this, 'drag-feedback');
}

function dragHandler(e) {
    // TODO
}

function dragEndHandler() {
    setDropZonesHighlight(false);
    this.classList.remove('dragged');
}

function dropZoneEnterHandler(e) {
    if (e.dataTransfer.types.includes('type/dragged-box')) {
        this.classList.add("over-zone");
        e.preventDefault();
    }
}

function dropZoneOverHandler(e) {
    if (e.dataTransfer.types.includes('type/dragged-box')) {
        e.preventDefault();
    }
}

function dropZoneLeaveHandler(e) {   
    if (e.dataTransfer.types.includes('type/dragged-box') &&
        e.relatedTarget !== null &&
        e.currentTarget !== e.relatedTarget.closest('.drop-zone')) {
        this.classList.remove("over-zone");
    }
}

function dropZoneDropHandler(e) {
    let draggedElement = document.querySelector('.dragged');
    let fromContainer = draggedElement.parentElement;
    let toContainer = e.currentTarget;
    let swappingElement = toContainer.querySelector(".draggable");
    
    toContainer.appendChild(draggedElement);    
    if(swappingElement != null) fromContainer.appendChild(swappingElement);

    collectionOfPages[currPageNumber-1].swapImage(fromContainer.dataset.id,toContainer.dataset.id);

    e.preventDefault();
}

function setDropZonesHighlight(highlight = true) {
    const dropZones = document.querySelectorAll(".drop-zone");
    for (const dropZone of dropZones) {
        if (highlight) {
            dropZone.classList.add("active-zone");
        } else {
            dropZone.classList.remove("active-zone");
            dropZone.classList.remove("over-zone");
        }
    }
}

function deferredOriginChanges(origin, dragFeedbackClassName) {
    setTimeout(() => {
        origin.classList.remove(dragFeedbackClassName);
    });
}