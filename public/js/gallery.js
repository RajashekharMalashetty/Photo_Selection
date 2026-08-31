function copyGalleryLink() {

    const input =
        document.getElementById("galleryLink");

    navigator.clipboard
        .writeText(input.value)
        .then(() => {

            alert("Gallery link copied!");

        })
        .catch(() => {

            alert("Unable to copy link.");

        });

}