<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Service\CategoryService;
use App\Http\Resources\CategoryResource;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    protected $categoryService;
    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }


    /**
     * @OA\Get(
     *     path="/api/category",
     *     summary="Get the list of categories",
     *     tags={"Category"},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/CategoryResource")
     *         ),
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Unauthenticated."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="You dont Have Permission."
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     *
     **/
    public function index()
    {

        if ($this->categoryService->checkIsAdminOrMd()) {

            $category = $this->categoryService->getAllCategory();

            if ($category) {
                return CategoryResource::collection($category)->additional([
                    "status" => "success",
                ]);
            }

            return response()->json([
                "status" => "error",
                "message" => "No Category found",
            ], 404);
        }

        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }


    /**
     * @OA\POST(
     *     path="/api/category/create",
     *     summary="Add new category",
     *     tags={"Category"},
     *      @OA\Parameter(
     *         name="name",
     *         in="query",
     *         description="The name of the category.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/CategoryResource")
     *         ),
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad Request",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="All fields are required."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Unauthenticated."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="You dont Have Permission."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal Server Error",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="An error occured."
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function store(Request $request)
    {
        if ($this->categoryService->checkIsAdminOrMd()) {

            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => "All fields are required",
                    "data" => $validator->errors()
                ], 400);
            }

            $addcategory = $this->categoryService->create($request->all());
            if ($addcategory) {
                $returnCategory = new CategoryResource($addcategory);
                $returnCategory->additional([
                    'status' => 'success',
                ]);
                return $returnCategory;
            }

            return response()->json([
                "status" => "error",
                "message" => "An error occured",
            ], 500);
        }

        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }


    /**
     * @OA\Get(
     *     path="/api/category/view/{category}",
     *     summary="Get a specific category",
     *     tags={"Category"},
     *     @OA\Parameter(
     *         name="category",
     *         in="path",
     *         required=true,
     *         description="The ID of the category to view",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/CategoryResource")
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Unauthenticated."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="You dont Have Permission."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No Category Found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="No Category Found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function show($category)
    {
        if ($this->categoryService->checkIsAdminOrMd()) {
            $getCategory = $this->categoryService->getCategoryById($category);
            if ($getCategory) {
                $returnCategory = new CategoryResource($getCategory);
                $returnCategory->additional([
                    'status' => 'success', // or any other status you want to append
                ]);
                return  $returnCategory;
            }

            return response()->json([
                "status" => "error",
                "message" => "No Category Found",
            ], 404);
        }
        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }

    /**
     * @OA\PUT(
     *     path="/api/category/update/{category}",
     *     summary="update category details",
     *     tags={"Category"},
     *      @OA\Parameter(
     *         name="category",
     *         in="path",
     *         description="The ID of the category to update.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="name",
     *                 type="string",
     *                 description="Name of the category",
     *                 example="Residential"
     *             ),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 example="success"
     *             ),
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Category updated successfully"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad Request",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="All fields are required."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Unauthenticated."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="You dont Have Permission."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal Server Error",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="An error occured."
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function update(Request $request, $category)
    {
        if ($this->categoryService->checkIsAdminOrMd()) {
            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => "All fields are required",
                    "data" => $validator->errors()
                ], 400);
            }

            $updatecategory = $this->categoryService->updateCategory($request->all(), $category);
            if ($updatecategory) {
                return response()->json([
                    "status" => "success",
                    "message" => "Category Updated successfully",
                ], 200);
            }

            return response()->json([
                "status" => "error",
                "message" => "An error occured",
            ], 500);
        }

        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }

    /**
     * @OA\Delete(
     *     path="/api/category/delete/{category}",
     *     summary="Delete a specific category",
     *     tags={"Category"},
     *     @OA\Parameter(
     *         name="category",
     *         in="path",
     *         required=true,
     *         description="The ID of the category to update",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 example="success"
     *             ),
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Category deleted successfully"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 example="error"
     *             ),
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="An error occurred"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Unauthenticated."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="You dont Have Permission"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No Category Found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="No Category Found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function destroy($category)
    {
        if ($this->categoryService->checkIsAdminOrMd()) {

            $categoryDelete = $this->categoryService->deleteCategory($category);
            if ($categoryDelete) {
                return response()->json([
                    "status" => "success",
                    "message" => "Category deleted successfully",
                ], 200);
            }

            return response()->json([
                "status" => "error",
                "message" => "An error occured",
            ], 400);
        }
        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }
}
