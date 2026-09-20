const React = require('react')
const { defineStore } = require('@deepseek-ai/dsh-client-store')
const {
  Button, Menu, Modal, StateDot, Tooltip,
  IconArchiveOutline20, IconBranchOutline16, IconCloseFill14,
  IconEditOutline16, IconEllipsisOutline16, IconFolderClose16,
  IconFolderOpen16, IconPlusOutline16,
  IconProjectAddOutline16, IconSearchOutline16, IconTrashOutline16,
  IconTriangleRightFill14,
} = require('@deepseek-ai/dsh-client-ui-primitives')

const h = React.createElement
const NS = 'sessionComps'
const PACKAGE_NAME = 'dsh-session-comps'
const API = '/dsh-session-comps/api'
const INDENT = 14
const SEARCH_DEBOUNCE_MS = 250
