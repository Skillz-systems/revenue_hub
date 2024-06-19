<?php

namespace App\Service;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;


class CategoryService
{
    /**
     * Retrieve all categories.
     *
     * This method returns a collection of all category from the database.
     *
     * @return Collection|Category[]  A collection of Category models.
     */
    public function getAllCategory()
    {
        return Category::all();
    }

    /**
     * Create a new  category.
     *
     * This method creates a new  category with the given data.
     *
     * @param array $data  The data to create the  category.
     * @return Category  The created Category model.
     */
    public function create($data)
    {
        return Category::create($data);
    }
    /**
     * Retrieve a  category by its name.
     *
     * This method returns the first  category that matches the given name.
     *
     * @param string $name  The name of the  category.
     * @return Category|null  The Category model if found, null otherwise.
     */
    public function getCategoryFromCategoryName($name)
    {
        return Category::where('name', $name)->first();
    }

    /**
     * Retrieve a  category by its ID.
     *
     * This method returns the first  category that matches the given ID.
     *
     * @param int $id  The ID of the  category.
     * @return Category|null  The Category model if found, null otherwise.
     */
    public function getCategoryById($id)
    {
        return Category::where('id', $id)->first();
    }

    /**
     * Update a  category by its ID.
     *
     * This method updates the  category with the given ID using the provided data.
     *
     * @param array $data  The data to update the  category.
     * @param int $id  The ID of the  category to update.
     * @return bool  True if the update was successful, false otherwise.
     */
    public function updateCategory($data, $id)
    {
        $updateData = $this->getCategoryById($id);
        return $updateData->update($data);
    }

    /**
     * Delete a  category by its ID.
     *
     * This method deletes the  category with the given ID.
     *
     * @param int $id  The ID of the  category to delete.
     * @return bool|null  True if the deletion was successful, false otherwise. Null if the  category was not found.
     */
    public function deleteCategory($id)
    {
        $delete = $this->getCategoryById($id);
        return $delete->delete();
    }

    /**
     * Check if the authenticated user is an admin or managing director (MD).
     *
     * This method checks if the currently authenticated user has a role ID
     * that corresponds to either an admin or managing director.
     *
     * @return bool  True if the user is an admin or MD, false otherwise.
     */
    public function checkIsAdminOrMd()
    {
        if (Auth::user()->role_id == User::ROLE_ADMIN || Auth::user()->role_id == User::ROLE_MD) {
            return true;
        }

        return false;
    }
}
