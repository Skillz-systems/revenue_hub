<?php

namespace App\Service;

use App\Models\Group;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class GroupService
{
    /**
     * Retrieve all Group.
     *
     * This method returns a collection of all Group from the database.
     *
     * @return Collection|Group[]  A collection of Group models.
     */
    public function getAllGroup()
    {
        return Group::all();
    }

    /**
     * Create a new Group.
     *
     * This method creates a new Group with the given data.
     *
     * @param array $data  The data to create the Group.
     * @return Group  The created Group model.
     */
    public function create($data)
    {
        return Group::create($data);
    }

    /**
     * Retrieve a Group by its name.
     *
     * This method returns the first Group that matches the given name.
     *
     * @param string $name  The name of the Group.
     * @return Group|null  The Group model if found, null otherwise.
     */
    public function getGroupFromGroupName($name)
    {
        return Group::where('name', $name)->first();
    }

    /**
     * Retrieve a Group by its ID.
     *
     * This method returns the first Group that matches the given ID.
     *
     * @param int $id  The ID of the Group.
     * @return Group|null  The Group model if found, null otherwise.
     */
    public function getGroupById($id)
    {
        return Group::where('id', $id)->first();
    }

    /**
     * Update a Group by its ID.
     *
     * This method updates the Group with the given ID using the provided data.
     *
     * @param array $data The data to update the Group.
     * @param int $id  The ID of the Group to update.
     * @return bool  True if the update was successful, false otherwise.
     */
    public function updateGroup($data, $id)
    {
        $updateData = $this->getGroupById($id);
        if ($updateData) {
            return $updateData->update($data);
        } else {
            throw new \Exception ("Group not found with ID: $id");
        }
    }

    /**
     * Delete a Group by its ID.
     *
     * This method deletes the Group with the given ID.
     *
     * @param int $id  The ID of the Group to delete.
     * @return bool|null  True if the deletion was successful, false otherwise. Null if the Group was not found.
     */
    public function deleteGroup($id)
    {
        $delete = $this->getGroupById($id);
        if ($delete) {
            return $delete->delete();
        } else {
            throw new \Exception ("Group not found with ID: $id");
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