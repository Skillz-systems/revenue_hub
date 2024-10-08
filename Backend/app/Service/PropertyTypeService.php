<?php

namespace App\Service;

use App\Models\User;
use App\Models\Property;
use App\Models\PropertyType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class PropertyTypeService
{
    /**
     * Retrieve all PropertyType.
     *
     * This method returns a collection of all PropertyType from the database.
     *
     * @return Collection|PropertyType[]  A collection of PropertyType models.
     */
    public function getAllPropertyType()
    {
        return PropertyType::all();
    }

    /**
     * Create a new PropertyType.
     *
     * This method creates a new PropertyType with the given data.
     *
     * @param array $data  The data to create the PropertyType.
     * @return PropertyType  The created PropertyType model.
     */
    public function create($data)
    {
        return PropertyType::create($data);
    }

    /**
     * Retrieve a PropertyType by its name.
     *
     * This method returns the first PropertyType that matches the given name.
     *
     * @param string $name  The name of the PropertyType.
     * @return PropertyType|null  The PropertyType model if found, null otherwise.
     */
    public function getPropertyTypeFromPropertyTypeName($name)
    {
        return PropertyType::where('name', $name)->first();
    }

    /**
     * Retrieve a PropertyType by its ID.
     *
     * This method returns the first PropertyType that matches the given ID.
     *
     * @param int $id  The ID of the PropertyType.
     * @return PropertyType|null  The PropertyType model if found, null otherwise.
     */
    public function getPropertyTypeById($id)
    {
        return PropertyType::where('id', $id)->first();
    }

    /**
     * Update a PropertyType by its ID.
     *
     * This method updates the PropertyType with the given ID using the provided data.
     *
     * @param array $data The data to update the PropertyType.
     * @param int $id  The ID of the PropertyType to update.
     * @return bool  True if the update was successful, false otherwise.
     */
    public function updatePropertyType($data, $id)
    {
        $updateData = $this->getPropertyTypeById($id);
        if ($updateData) {
            return $updateData->update($data);
        } else {
            throw new \Exception("Property type not found with ID: $id");
        }
    }

    /**
     * Delete a PropertyType by its ID.
     *
     * This method deletes the PropertyType with the given ID.
     *
     * @param int $id  The ID of the PropertyType to delete.
     * @return bool|null  True if the deletion was successful, false otherwise. Null if the PropertyType was not found.
     */
    public function deletePropertyType($id)
    {
        $delete = $this->getPropertyTypeById($id);
        if ($delete) {
            return $delete->delete();
        } else {
            throw new \Exception("Property type not found with ID: $id");
        }
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
