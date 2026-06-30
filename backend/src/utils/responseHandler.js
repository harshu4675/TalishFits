const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = { success: true, message }
  if (data !== null) response.data = data
  return res.status(statusCode).json(response)
}

const errorResponse = (res, statusCode = 500, message = 'Something went wrong', errors = null) => {
  const response = { success: false, message }
  if (errors) response.errors = errors
  return res.status(statusCode).json(response)
}

const paginatedResponse = (res, data, pagination) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrev: pagination.page > 1,
    },
  })
}

module.exports = { successResponse, errorResponse, paginatedResponse }