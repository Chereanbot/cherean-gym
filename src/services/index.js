export const addData = async (currentTab, formData) => {
    try {
        const response = await fetch(`/api/${currentTab}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json()
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to add data')
        }
        
        return data
    } catch (error) {
        console.error('Error adding data:', error)
        return { success: false, message: error.message }
    }
}

export async function getData(type, queryParams = '') {
    try {
        let endpoint;
        switch (type) {
            case 'blog':
                endpoint = `/api/${type}/client/posts`;
                break;
            case 'background':
                endpoint = `/api/${type}`;
                break;
            default:
                endpoint = `/api/${type}/get`;
        }

        // Ensure we have a valid URL by using window.location.origin for client-side
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const url = `${baseUrl}${endpoint}${queryParams}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch data');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { success: false, message: error.message };
    }
}

export const updateData = async (currentTab, id, formData) => {
    try {
        const response = await fetch(`/api/${currentTab}/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `Failed to update ${currentTab}`);
        }
        
        return {
            success: true,
            message: data.message || `${currentTab} updated successfully`,
            data: data.data
        };
    } catch (error) {
        console.error(`Error updating ${currentTab}:`, error);
        return {
            success: false,
            message: error.message || `Error updating ${currentTab}`
        };
    }
};

export const login = async (formData) => {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json()
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed')
        }
        
        return data
    } catch (error) {
        console.error('Error during login:', error)
        return { success: false, message: error.message }
    }
}

export const handleDelete = async (type, id) => {
    try {
        const response = await fetch(`/api/${type}/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `Failed to delete ${type}`);
        }
        
        return {
            success: true,
            message: data.message || `${type} deleted successfully`
        };
    } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        return {
            success: false,
            message: error.message || `Error deleting ${type}`
        };
    }
};

export const handleEdit = async (type, id) => {
    try {
        const response = await fetch(`/api/${type}/get/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch item')
        }
        
        return data
    } catch (error) {
        console.error('Error fetching item:', error)
        return { success: false, message: error.message }
    }
}

export const analyzeBlogImage = async (imageUrl) => {
    try {
        const response = await fetch('/api/blog/analyze-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to analyze image');
        }
        
        return data;
    } catch (error) {
        console.error('Error analyzing image:', error);
        return { success: false, message: error.message };
    }
}

