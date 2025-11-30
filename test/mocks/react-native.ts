import React, { JSX } from 'react'

type ChildrenProps = { children?: React.ReactNode }

const createElement =
	(tag: keyof JSX.IntrinsicElements) =>
	({ children, ...rest }: ChildrenProps & Record<string, unknown>) =>
		React.createElement(tag, rest, children)

export const Text = createElement('span')
export const View = createElement('div')
export const KeyboardAvoidingView = createElement('div')

export const Pressable = ({
	children,
	onPress,
	accessibilityRole,
	accessibilityLabel,
	accessibilityState,
	disabled,
	...rest
}: ChildrenProps & {
	onPress?: () => void
	accessibilityRole?: string
	accessibilityLabel?: string
	accessibilityState?: { selected?: boolean }
	disabled?: boolean
}) =>
	React.createElement(
		'button',
		{
			type: 'button',
			onClick: onPress,
			role: accessibilityRole ?? 'button',
			'aria-label': accessibilityLabel,
			'aria-checked':
				accessibilityRole === 'radio' || accessibilityRole === 'checkbox'
					? String(Boolean(accessibilityState?.selected))
					: undefined,
			disabled,
			...rest
		},
		children
	)

export const TextInput = ({
	children,
	onChangeText,
	accessibilityRole,
	placeholderTextColor: _placeholderTextColor,
	cursorColor: _cursorColor,
	returnKeyType: _returnKeyType,
	textAlignVertical: _textAlignVertical,
	...rest
}: ChildrenProps & {
	onChangeText?: (value: string) => void
	accessibilityRole?: string
	placeholderTextColor?: string
	cursorColor?: string
	returnKeyType?: string
	textAlignVertical?: string
}) =>
	React.createElement('input', {
		...rest,
		role: accessibilityRole ?? 'textbox',
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
			onChangeText?.(event.target.value)
		}
	})

export const Modal = ({
	visible,
	children
}: { visible: boolean } & ChildrenProps) =>
	visible ? React.createElement(React.Fragment, null, children) : null

let currentOS: 'ios' | 'android' | 'web' = 'ios'
export const Platform = {
	get OS() {
		return currentOS
	},
	set OS(value: 'ios' | 'android' | 'web') {
		currentOS = value
	},
	select: <T>(options: Record<string, T>) =>
		options[currentOS] ?? options.default
}

export const StyleSheet = { create: (styles: unknown) => styles }

const defaultExport = {
	Platform,
	Text,
	View,
	Pressable,
	TextInput,
	Modal,
	KeyboardAvoidingView,
	StyleSheet
}

export default defaultExport
