<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prix' => 'required|numeric|min:0',
            'description' => 'required|string',
            'categorie' => 'required|string|max:100',
            'stock' => 'required|integer|min:0',
            'image' => 'required|image|max:2048', // Max 2MB
        ]);

        // Handle image upload
        $imagePath = $request->file('image')->store('products', 'public');
        
        $product = Product::create([
            'nom' => $request->nom,
            'prix' => $request->prix,
            'description' => $request->description,
            'categorie' => $request->categorie,
            'stock' => $request->stock,
            'image' => $imagePath,
        ]);

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $request->validate([
            'nom' => 'string|max:255',
            'prix' => 'numeric|min:0',
            'description' => 'string',
            'categorie' => 'string|max:100',
            'stock' => 'integer|min:0',
            'image' => 'sometimes|image|max:2048', // Max 2MB
        ]);

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            
            $imagePath = $request->file('image')->store('products', 'public');
            $product->image = $imagePath;
        }
        
        $product->nom = $request->nom ?? $product->nom;
        $product->prix = $request->prix ?? $product->prix;
        $product->description = $request->description ?? $product->description;
        $product->categorie = $request->categorie ?? $product->categorie;
        $product->stock = $request->stock ?? $product->stock;
        
        $product->save();

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        // Delete image from storage
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        
        $product->delete();
        
        return response()->json(null, 204);
    }
}