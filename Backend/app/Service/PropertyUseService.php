<?php

namespace App\Service;

use App\Models\PropertyUse;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class PropertyUseService
{

    /**
     * Retrieve all property use.
     *
     * This method returns a collection of all property use from the database.
     *
     * @return Collection|PropertyUse[]  A collection of PropertyUse models.
     */
    public function getAllPropertyUse()
    {
        return PropertyUse::all();
    }

    /**
     * Create a new  property use.
     *
     * This method creates a new  property use with the given data.
     *
     * @param array $data  The data to create the  property use.
     * @return PropertyUse  The created PropertyUse model.
     */
    public function create($data)
    {
        return PropertyUse::create($data);
    }

    /**
     * Retrieve a  property use by its name.
     *
     * This method returns the first  property use that matches the given name.
     *
     * @param string $name  The name of the  property use.
     * @return PropertyUse|null  The PropertyUse model if found, null otherwise.
     */

    public function getPropertyUseFromPropertyUseName($name)
    {
        return PropertyUse::where('name', $name)->first();
    }

    /**
     * Retrieve a  property use by its ID.
     *
     * This method returns the first  property use that matches the given ID.
     *
     * @param int $id  The ID of the  property use.
     * @return PropertyUse|null  The PropertyUse model if found, null otherwise.
     */
    public function getPropertyUseById($id)
    {
        return PropertyUse::where('id', $id)->first();
    }

    /**
     * Update a  property use by its ID.
     *
     * This method updates the  property use with the given ID using the provided data.
     *
     * @param array $data  The data to update the  property use.
     * @param int $id  The ID of the  property use to update.
     * @return bool  True if the update was successful, false otherwise.
     */
    public function updatePropertyUse($data, $id)
    {
        $updateData = $this->getPropertyUseById($id);
        return $updateData->update($data);
    }

    /**
     * Delete a  property use by its ID.
     *
     * This method deletes the  property use with the given ID.
     *
     * @param int $id  The ID of the  property use to delete.
     * @return bool|null  True if the deletion was successful, false otherwise. Null if the  property use was not found.
     */
    public function deletePropertyUse($id)
    {
        $delete = $this->getPropertyUseById($id);
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
