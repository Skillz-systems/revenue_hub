<?php

namespace App\Service;

use App\Models\User;
use App\Models\RatingDistrict;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class RatingDistrictService
{
    /**
     * Retrieve all RatingDistrict.
     *
     * This method returns a collection of all RatingDistrict from the database.
     *
     * @return Collection|RatingDistrict[]  A collection of RatingDistrict models.
     */
    public function getAllRatingDistrict()
    {
        return RatingDistrict::all();
    }

    /**
     * Create a new RatingDistrict.
     *
     * This method creates a new RatingDistrict with the given data.
     *
     * @param array $data  The data to create the RatingDistrict.
     * @return RatingDistrict  The created RatingDistrict model.
     */
    public function create($data)
    {
        return RatingDistrict::create($data);
    }
    
    /**
     * Retrieve a RatingDistrict by its name.
     *
     * This method returns the first RatingDistrict that matches the given name.
     *
     * @param string $name  The name of the RatingDistrict.
     * @return RatingDistrict|null  The RatingDistrict model if found, null otherwise.
     */
    public function getRatingDistrictFromDistrictName($name)
    {
        return RatingDistrict::where('name', $name)->first();
    }


    /**
     * Retrieve a RatingDistrict by its ID.
     *
     * This method returns the first RatingDistrict that matches the given ID.
     *
     * @param int $id  The ID of the RatingDistrict.
     * @return RatingDistrict|null  The RatingDistrict model if found, null otherwise.
     */
    public function getRatingDistrictById($id)
    {
        return RatingDistrict::where('id', $id)->first();
    }

    /**
     * Update a RatingDistrict by its ID.
     *
     * This method updates the RatingDistrict with the given ID using the provided data.
     *
     * @param array $data The data to update the RatingDistrict.
     * @param int $id  The ID of the RatingDistrict to update.
     * @return bool  True if the update was successful, false otherwise.
     */
    public function updateRatingDistrict($data, $id)
    {
        $updateData = $this->getRatingDistrictById($id);
        if ($updateData) {
            return $updateData->update($data);
        } else {
            throw new \Exception ("Rating District not found with ID: $id");
        }
    }

    /**
     * Delete a RatingDistrict by its ID.
     *
     * This method deletes the RatingDistrict with the given ID.
     *
     * @param int $id  The ID of the RatingDistrict to delete.
     * @return bool|null  True if the deletion was successful, false otherwise. Null if the RatingDistrict was not found.
     */
    public function deleteRatingDistrict($id)
    {
        $delete = $this->getRatingDistrictById($id);
        if ($delete) {
            return $delete->delete();
        } else {
            throw new \Exception ("Rating District not found with ID: $id");
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
