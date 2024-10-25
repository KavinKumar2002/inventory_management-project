document.addEventListener('DOMContentLoaded', () => {
    const fromLocationInput = document.getElementById('from_location');
    const toLocationSelect = document.getElementById('to_location');
    const productIdSelect = document.getElementById('product_id');

    if (!fromLocationInput || !toLocationSelect || !productIdSelect) {
        console.error("One or more elements are not found.");
        return; // Exit if critical elements are not found
    }

    function updateFromLocations() {
        const productId = productIdSelect.value;

        fromLocationInput.value = ''; // Clear the input value
        fromLocationInput.disabled = true; // Disable input by default
        toLocationSelect.innerHTML = '<option value="">Select a location</option>'; // Reset

        if (productId) {
            fetch(`/api/current_location?product_id=${productId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.current_location) {
                        fromLocationInput.value = data.current_location;
                        fromLocationInput.disabled = false; // Enable the input

                        updateToLocationOptions(data.current_location); // Update options
                    } else {
                        console.log('No current location found for this product.');
                    }
                })
                .catch(error => console.error('Error fetching current location:', error));
        }
    }

    function updateToLocationOptions(fromLocationValue) {
        toLocationSelect.innerHTML = '<option value="">Select a location</option>';

        const productId = productIdSelect.value;
        if (productId) {
            fetch(`/api/locations?product_id=${productId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.locations) {
                        data.locations.forEach(location => {
                            if (location.location_id !== fromLocationValue) {
                                const option = document.createElement('option');
                                option.value = location.location_id;
                                option.textContent = location.location_id;
                                toLocationSelect.appendChild(option);
                            }
                        });
                    }
                })
                .catch(error => console.error('Error fetching locations:', error));
        }
    }

    productIdSelect.addEventListener('change', updateFromLocations);
});
