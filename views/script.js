// Add Event Listeners for Delete Buttons
const deleteButtons = document.querySelectorAll('.delete-button');

deleteButtons.forEach(button => {
  button.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default link behavior
    if (confirm('Are you sure you want to delete this blog post?')) {
      const blogId = button.parentElement.parentElement.dataset.id; 
      const response = await fetch(`/delete/${blogId}`);
      if (response.ok) {
        // Update the page
        window.location.reload(); // Refresh the page
      } else {
        console.error('Error deleting blog post');
        // You could display an error message here if needed
      }
    }
  });
});

// Add Event Listeners for Edit Buttons (similar to delete)
const editButtons = document.querySelectorAll('.edit-button');

editButtons.forEach(button => {
  button.addEventListener('click', async (event) => {
    event.preventDefault(); 
    const blogId = button.parentElement.parentElement.dataset.id; 
    const response = await fetch(`/edit/${blogId}`);
    if (response.ok) {
      // Redirect to the edit page
      window.location.href = `/edit/${blogId}`; 
    } else {
      console.error('Error getting blog for editing');
      // You could display an error message here
    }
  });
});

// Add data-id to posts
const posts = document.querySelectorAll('.post');
posts.forEach(post => {
  const blogId = post.querySelector('.actions .edit-button').href.split('/').pop();
  post.dataset.id = blogId;
});




