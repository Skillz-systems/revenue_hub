<?php

namespace App\Service;


use App\Models\User;
use App\Models\Street;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class StreetService
{
    /**
     * Retrieve all streets.
     *
     * This method returns a collection of all streets from the database.
     *
     * @return Collection|Street[]  A collection of Street models.
     */
    public function getAllStreet()
    {
        return Street::all();
    }

    /**
     * Create a new street.
     *
     * This method creates a new street with the given data.
     *
     * @param array $data  The data to create the street.
     * @return Street  The created Street model.
     */
    public function create($data)
    {
        return Street::create($data);
    }

    /**
     * Retrieve a street by its name.
     *
     * This method returns the first street that matches the given name.
     *
     * @param string $name  The name of the street.
     * @return Street|null  The Street model if found, null otherwise.
     */
    public function getStreetFromStreetName($name)
    {
        return Street::where('name', $name)->first();
    }

    /**
     * Retrieve a street by its ID.
     *
     * This method returns the first street that matches the given ID.
     *
     * @param int $id  The ID of the street.
     * @return Street|null  The Street model if found, null otherwise.
     */
    public function getStreetById($id)
    {
        return Street::where('id', $id)->first();
    }

    /**
     * Update a street by its ID.
     *
     * This method updates the street with the given ID using the provided data.
     *
     * @param array $data  The data to update the street.
     * @param int $id  The ID of the street to update.
     * @return bool  True if the update was successful, false otherwise.
     */
    public function updateStreet($data, $id)
    {
        $updateData = $this->getStreetById($id);
        return $updateData->update($data);
    }

    /**
     * Delete a street by its ID.
     *
     * This method deletes the street with the given ID.
     *
     * @param int $id  The ID of the street to delete.
     * @return bool|null  True if the deletion was successful, false otherwise. Null if the street was not found.
     */
    public function deleteStreet($id)
    {
        $delete = $this->getStreetById($id);
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
