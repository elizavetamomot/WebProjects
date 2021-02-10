const dropItems = document.querySelector('#drop-items');

new Sortable(dropItems, {
    animation: 350,
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag"
})