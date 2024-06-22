<?php

namespace App\Service;

use App\Models\User;
use App\Models\CadastralZone;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Collection;

class CadastralZoneService
{
    /**
     * Retrieve all cadastral zones.
     *
     * This method returns a collection of all cadastral zones from the database.
     *
     * @return Collection|CadastralZone[]  A collection of CadastralZone models.
     */
    public function getAllCadastralZone()
    {
        return CadastralZone::all();
    }

    /**
     * Create a new cadastral zone.
     *
     * This method creates a new cadastral zone with the given data.
     *
     * @param array $data  The data to create the cadastral zone.
     * @return CadastralZone  The created CadastralZone model.
     */
    public function create($data)
    {
        return CadastralZone::create($data);
    }

    /**
     * Retrieve a cadastral zone by its name.
     *
     * This method returns the first cadastral zone that matches the given name.
     *
     * @param string $name  The name of the cadastral zone.
     * @return CadastralZone|null  The CadastralZone model if found, null otherwise.
     */
    public function getCadastralZoneFromZoneName($name)
    {
        return CadastralZone::where('name', $name)->first();
    }

    /**
     * Retrieve a cadastral zone by its ID.
     *
     * This method returns the first cadastral zone that matches the given ID.
     *
     * @param int $id  The ID of the cadastral zone.
     * @return CadastralZone|null  The CadastralZone model if found, null otherwise.
     */
    public function getCadastralZoneById($id)
    {
        return CadastralZone::where('id', $id)->first();
    }

    /**
     * Update a cadastral zone by its ID.
     *
     * This method updates the cadastral zone with the given ID using the provided data.
     *
     * @param array $data  The data to update the cadastral zone.
     * @param int $id  The ID of the cadastral zone to update.
     * @return bool  True if the update was successful, false otherwise.
     */
    public function updateCadastralZone($data, $id)
    {
        $updateData = $this->getCadastralZoneById($id);
        return $updateData->update($data);
    }

    /**
     * Delete a cadastral zone by its ID.
     *
     * This method deletes the cadastral zone with the given ID.
     *
     * @param int $id  The ID of the cadastral zone to delete.
     * @return bool|null  True if the deletion was successful, false otherwise. Null if the cadastral zone was not found.
     */
    public function deleteCadastralZone($id)
    {
        $delete = $this->getCadastralZoneById($id);
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
