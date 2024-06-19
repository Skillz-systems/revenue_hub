<?php

namespace App\Service;

use App\Models\User;
use App\Models\OfficeZone;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Collection;

class OfficeZoneService
{
    /**
     * Retrieve all office zone.
     *
     * This method returns a collection of all office zone from the database.
     *
     * @return Collection|OfficeZone[]  A collection of OfficeZone models.
     */
    public function getAllOfficeZone()
    {
        return OfficeZone::all();
    }

    /**
     * Create a new office zone.
     *
     * This method creates a new office zone with the given data.
     *
     * @param array $data  The data to create the office zone.
     * @return OfficeZone  The created OfficeZone model.
     */
    public function create($data)
    {
        return OfficeZone::create($data);
    }

    /**
     * Retrieve a office zone by its name.
     *
     * This method returns the first office zone that matches the given name.
     *
     * @param string $name  The name of the office zone.
     * @return OfficeZone|null  The OfficeZone model if found, null otherwise.
     */
    public function getOfficeZoneFromZoneName($name)
    {
        return OfficeZone::where('name', $name)->first();
    }

    /**
     * Retrieve a office zone by its ID.
     *
     * This method returns the first office zone that matches the given ID.
     *
     * @param int $id  The ID of the office zone.
     * @return OfficeZone|null  The OfficeZone model if found, null otherwise.
     */
    public function getOfficeZoneById($id)
    {
        return OfficeZone::where('id', $id)->first();
    }

    /**
     * Update a office zone by its ID.
     *
     * This method updates the office zone with the given ID using the provided data.
     *
     * @param array $data  The data to update the office zone.
     * @param int $id  The ID of the office zone to update.
     * @return bool  True if the update was successful, false otherwise.
     */
    public function updateOfficeZone($data, $id)
    {
        $updateData = $this->getOfficeZoneById($id);
        return $updateData->update($data);
    }

    /**
     * Delete a office zone by its ID.
     *
     * This method deletes the office zone with the given ID.
     *
     * @param int $id  The ID of the office zone to delete.
     * @return bool|null  True if the deletion was successful, false otherwise. Null if the office zone was not found.
     */
    public function deleteOfficeZone($id)
    {
        $delete = $this->getOfficeZoneById($id);
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
