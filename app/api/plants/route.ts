import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPlantSchema } from "@/lib/validations/plant";
import { validatePagination, sanitizeString } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const { page, limit } = validatePagination(
      searchParams.get("page") || undefined,
      searchParams.get("limit") || undefined
    );
    const search = sanitizeString(searchParams.get("search") || "");
    const location = sanitizeString(searchParams.get("location") || "");
    const species = sanitizeString(searchParams.get("species") || "");

    const skip = (page - 1) * limit;

    const where = {
      userId: session.user.id,
      isDeleted: false,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { species: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(location && { location: { contains: location, mode: "insensitive" as const } }),
      ...(species && { species: { contains: species, mode: "insensitive" as const } }),
    };

    const [plants, total] = await Promise.all([
      prisma.plant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          species: true,
          imageUrl: true,
          location: true,
          acquisitionDate: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.plant.count({ where }),
    ]);

    const response = NextResponse.json({
      plants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

    // Disable cache to ensure fresh data after deletions
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    
    return response;
  } catch (error) {
    console.error("Get plants error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createPlantSchema.parse(body);

    const plant = await prisma.plant.create({
      data: {
        ...validatedData,
        acquisitionDate: validatedData.acquisitionDate
          ? new Date(validatedData.acquisitionDate)
          : null,
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        species: true,
        imageUrl: true,
        location: true,
        acquisitionDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(plant, { status: 201 });
  } catch (error) {
    console.error("Create plant error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
