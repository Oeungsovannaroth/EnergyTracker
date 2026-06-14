# MongoDB Schema

## users
- `_id`, `name`, `email`, `password`, `role`, `status`, `company`, `phone`, `avatar`, `avatar_url`, `email_verified_at`, `created_at`, `updated_at`
- Roles: `admin`, `user`
- Statuses: `active`, `invited`, `suspended`

## regions
- `_id`, `name`, `description`, `created_at`, `updated_at`

## countries
- `_id`, `region_id`, `name`, `slug`, `flag`, `image`, `description`, `created_at`, `updated_at`

## spotlights
- `_id`, `country_id`, `title`, `content`, `thumbnail`, `status`, `created_at`, `updated_at`

## categories
- `_id`, `parent_id`, `name`, `slug`, `type`, `path`, `description`, `sort_order`, `is_published`, `created_at`, `updated_at`

## articles
- `_id`, `category_id`, `country_id`, `author_id`, `title`, `slug`, `summary`, `content`, `thumbnail`, `views`, `status`, `created_at`, `updated_at`
- Statuses: `draft`, `published`, `archived`

## features
- `_id`, `article_id`, `title`, `description`, `image`, `created_at`, `updated_at`

## blogs
- `_id`, `category_id`, `author_id`, `title`, `slug`, `content`, `thumbnail`, `views`, `status`, `created_at`, `updated_at`
- Statuses: `draft`, `published`, `archived`

## comments
- `_id`, `blog_id`, `user_id`, `comment`, `created_at`, `updated_at`

## media
- `_id`, `author_id`, `type`, `title`, `description`, `thumbnail`, `media_url`, `duration`, `created_at`, `updated_at`

## publications
- `_id`, `author_id`, `title`, `description`, `publication_type`, `image`, `file_url`, `download_count`, `created_at`, `updated_at`

## bookmarks
- `_id`, `user_id`, `article_id`, `created_at`

## orders
- `_id`, `order_number`, `customer`, `email`, `product`, `amount`, `status`, `history[]`, `user_id`, `meta`, `created_at`, `updated_at`
- Statuses: `pending`, `processing`, `completed`, `cancelled`

## content_items
- `_id`, `type`, `title`, `desc`, `category_id`, `category`, `image`, `link`, `meta`, `sort_order`, `is_published`, `created_at`, `updated_at`
- Shop products use `type = product`.

## invoices
- `_id`, `invoice_number`, `order_id`, `order_number`, `customer`, `email`, `subtotal`, `tax`, `total`, `status`, `due_date`, `items[]`, `created_at`, `updated_at`

## notifications
- `_id`, `type`, `channel`, `title`, `message`, `status`, `payload`, `created_at`, `updated_at`

## analytics
- `_id`, `month`, `revenue`, `orders`, `users`, `active_users`, `growth_rate`, `created_at`, `updated_at`

## system_settings
- `_id`, `key`, `value`, `group`, `is_secret`, `created_at`, `updated_at`
